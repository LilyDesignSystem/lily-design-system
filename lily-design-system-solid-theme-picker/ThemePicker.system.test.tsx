import { cleanup, fireEvent, render, screen } from "./test-utils";
import { createSignal } from "solid-js";
import { act } from "./test-act";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import ThemePicker from "./ThemePicker";
import { SYSTEM_THEME, readThemeCookie, themeCookie } from "./theme-choice.js";

// spec §5.6 "Follow this device" and §5.7 the theme cookie (ported from the Svelte reference, 2026-11-16).

// In the order the picker lists them: alphabetical by the name shown (spec/theme-picker, "Order of themes").
const THEMES = ["abyss", "dark", "light"];
const base = { label: "Theme", themesUrl: "/assets/themes/", themes: THEMES };
const withSystem = { ...base, systemLabel: "Follow this device" };

/** A matchMedia whose dark-scheme answer the test can change, telling its listeners. */
function stubScheme(dark: boolean) {
    const original = window.matchMedia;
    let matches = dark;
    const listeners = new Set<(e: { matches: boolean }) => void>();
    window.matchMedia = ((q: string) => ({
        get matches() {
            return q.includes("dark") && matches;
        },
        media: q,
        addEventListener: (_: string, fn: (e: { matches: boolean }) => void) => listeners.add(fn),
        removeEventListener: (_: string, fn: (e: { matches: boolean }) => void) =>
            listeners.delete(fn),
    })) as unknown as typeof window.matchMedia;
    return {
        set(next: boolean) {
            matches = next;
            act(() => {
                for (const fn of listeners) fn({ matches: next });
            });
        },
        listeners,
        restore() {
            window.matchMedia = original;
        },
    };
}

const dataTheme = () => document.documentElement.getAttribute("data-theme");
const clearCookie = () => (document.cookie = "theme=; Path=/; Max-Age=0");

async function choose(name: string) {
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("option", { name, hidden: true }));
}

beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.head.querySelectorAll("link[data-lily-theme-picker]").forEach((n) => n.remove());
    clearCookie();
    localStorage.clear();
});

afterEach(() => {
    cleanup();
    clearCookie();
});

describe("ThemePicker — follow this device (§5.6, §7.35–§7.39)", () => {
    test("§7.35 systemLabel adds a first option, value system, with its own class hook", () => {
        render(() => <ThemePicker {...withSystem} />);
        const options = screen.getAllByRole("option", { hidden: true });
        expect(options.map((o) => o.textContent)).toEqual([
            "Follow this device",
            "Abyss",
            "Dark",
            "Light",
        ]);
        expect(options[0]!.classList.contains("theme-picker-option-system")).toBe(true);
        expect(options[1]!.classList.contains("theme-picker-option-system")).toBe(false);
    });

    test("§7.35 without systemLabel there is no such option", () => {
        render(() => <ThemePicker {...base} />);
        expect(screen.getAllByRole("option", { hidden: true })).toHaveLength(3);
        expect(document.querySelector(".theme-picker-option-system")).toBeNull();
    });

    test("§7.36 with systemLabel and nothing kept, the picker follows the device", () => {
        const scheme = stubScheme(true);
        const onChange = vi.fn();
        render(() => (
            <ThemePicker
                {...withSystem}
                onChange={onChange}
            />
        ));
        expect(dataTheme()).toBe("dark");
        expect((document.querySelector("input[type=hidden]") as HTMLInputElement).value).toBe(
            SYSTEM_THEME,
        );
        expect(
            screen
                .getByRole("option", { name: "Follow this device", hidden: true })
                .getAttribute("aria-selected"),
        ).toBe("true");
        expect(onChange).toHaveBeenLastCalledWith("dark", SYSTEM_THEME);
        scheme.restore();
    });

    test("§7.37 while following, a device switch changes the theme, once", () => {
        const scheme = stubScheme(false);
        const onChange = vi.fn();
        render(() => (
            <ThemePicker
                {...withSystem}
                onChange={onChange}
            />
        ));
        expect(dataTheme()).toBe("light");
        onChange.mockClear();
        scheme.set(true);
        expect(dataTheme()).toBe("dark");
        expect(onChange).toHaveBeenCalledOnce();
        expect(onChange).toHaveBeenCalledWith("dark", SYSTEM_THEME);
        scheme.restore();
    });

    test("§7.37 choosing a theme stops following the device", async () => {
        const scheme = stubScheme(false);
        render(() => <ThemePicker {...withSystem} />);
        await choose("Abyss");
        expect(dataTheme()).toBe("abyss");
        expect(scheme.listeners.size).toBe(0);
        scheme.set(true);
        expect(dataTheme()).toBe("abyss");
        scheme.restore();
    });

    test("§7.37 a controlled picker stores the choice from onChange and keeps following", () => {
        const scheme = stubScheme(false);
        function Host() {
            const [value, setValue] = createSignal(SYSTEM_THEME);
            return (
                <ThemePicker
                    {...withSystem}
                    value={value()}
                    onChange={(_theme, choice) => setValue(choice)}
                />
            );
        }
        render(() => <Host />);
        expect(dataTheme()).toBe("light");
        scheme.set(true);
        expect(dataTheme()).toBe("dark");
        expect((document.querySelector("input[type=hidden]") as HTMLInputElement).value).toBe(
            SYSTEM_THEME,
        );
        scheme.restore();
    });

    test("§7.38 systemThemes chooses which themes the device maps to", () => {
        const scheme = stubScheme(true);
        render(() => (
            <ThemePicker
                {...withSystem}
                systemThemes={{ light: "light", dark: "abyss" }}
            />
        ));
        expect(dataTheme()).toBe("abyss");
        scheme.restore();
    });

    test("§7.39 the native select variant offers it too, followed by a separator", () => {
        render(() => (
            <ThemePicker
                {...withSystem}
                variant="select"
            />
        ));
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        expect(select.options[0]!.value).toBe(SYSTEM_THEME);
        expect(select.options[0]!.textContent).toBe("Follow this device");
        expect(select.querySelector("hr.theme-picker-separator")).toBeTruthy();
    });
});

describe("ThemePicker — kept in a cookie (§5.7, §7.40–§7.42)", () => {
    test("§7.40 a choice is written to the cookie: the choice, not the theme it applies", async () => {
        const scheme = stubScheme(true);
        render(() => (
            <ThemePicker
                {...withSystem}
                cookieName="theme"
            />
        ));
        // The starting choice is not written: a first visit sets no cookie.
        expect(readThemeCookie(document.cookie, "theme")).toBe("");
        await choose("Dark");
        expect(readThemeCookie(document.cookie, "theme")).toBe("dark");
        await choose("Follow this device");
        expect(dataTheme()).toBe("dark");
        expect(readThemeCookie(document.cookie, "theme")).toBe(SYSTEM_THEME);
        scheme.restore();
    });

    test("§7.41 the cookie sets the starting choice, above localStorage", () => {
        document.cookie = themeCookie("theme", "abyss");
        localStorage.setItem("lily-theme", "dark");
        render(() => (
            <ThemePicker
                {...base}
                cookieName="theme"
                storageKey="lily-theme"
            />
        ));
        expect(dataTheme()).toBe("abyss");
    });

    test("§7.42 a cookie that is not one of the choices is ignored", () => {
        document.cookie = themeCookie("theme", "../../evil");
        render(() => (
            <ThemePicker
                {...base}
                cookieName="theme"
            />
        ));
        expect(dataTheme()).toBe("light");
        expect(
            document.head.querySelector("link[data-lily-theme-picker]")!.getAttribute("href"),
        ).toBe("/assets/themes/light.css");
    });
});

describe("ThemePicker — kept by default (§5.8, §7.44–§7.46)", () => {
    test("§7.44 with no storageKey or cookieName, a choice is kept in both, under lily-{name}", async () => {
        const { unmount } = render(() => <ThemePicker {...base} />);
        await choose("Abyss");
        expect(localStorage.getItem("lily-theme")).toBe("abyss");
        expect(readThemeCookie(document.cookie, "lily-theme")).toBe("abyss");
        unmount();
        render(() => (
            <ThemePicker
                {...base}
                name="brand"
            />
        ));
        await choose("Dark");
        expect(localStorage.getItem("lily-brand")).toBe("dark");
        expect(readThemeCookie(document.cookie, "lily-brand")).toBe("dark");
    });

    test("§7.45 the first load stores nothing until the choice changes", () => {
        render(() => <ThemePicker {...withSystem} />);
        expect(localStorage.length).toBe(0);
        expect(document.cookie).toBe("");
    });

    test("§7.46 an empty string turns either store off", async () => {
        const { unmount } = render(() => (
            <ThemePicker
                {...base}
                storageKey=""
                cookieName=""
            />
        ));
        await choose("Abyss");
        expect(localStorage.length).toBe(0);
        expect(document.cookie).toBe("");
        unmount();
        render(() => (
            <ThemePicker
                {...base}
                cookieName=""
            />
        ));
        await choose("Dark");
        expect(localStorage.getItem("lily-theme")).toBe("dark");
        expect(document.cookie).toBe("");
    });
});
