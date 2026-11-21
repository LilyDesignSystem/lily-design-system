import { render, screen, fireEvent } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import ThemePicker from "./ThemePicker.svelte";
import {
    SYSTEM_THEME,
    THEME_COOKIE_MAX_AGE,
    readThemeCookie,
    resolveTheme,
    themeCookie,
} from "./theme-choice.js";

// §5.6 "Follow this device" and §5.7 the theme cookie.

// In the order the picker lists them: alphabetical by the name shown (spec/theme-picker, "Order of themes").
const THEMES = ["abyss", "dark", "light"];
const base = { label: "Theme", themesUrl: "/assets/themes/", themes: THEMES };
const withSystem = { ...base, systemLabel: "Follow this device" };

/** A matchMedia whose dark-scheme answer the test can change, telling its listeners. */
function stubScheme(dark: boolean) {
    const original = (window as any).matchMedia;
    let matches = dark;
    const listeners = new Set<(e: { matches: boolean }) => void>();
    (window as any).matchMedia = (q: string) => ({
        get matches() {
            return q.includes("dark") && matches;
        },
        media: q,
        addEventListener: (_: string, fn: (e: { matches: boolean }) => void) => listeners.add(fn),
        removeEventListener: (_: string, fn: (e: { matches: boolean }) => void) =>
            listeners.delete(fn),
    });
    return {
        set(next: boolean) {
            matches = next;
            for (const fn of listeners) fn({ matches: next });
        },
        listeners,
        restore() {
            (window as any).matchMedia = original;
        },
    };
}

function clearCookie(name = "theme") {
    document.cookie = `${name}=; Path=/; Max-Age=0`;
}

const dataTheme = () => document.documentElement.getAttribute("data-theme");
const flush = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.head.querySelectorAll("link[data-lily-theme-picker]").forEach((n) => n.remove());
    clearCookie();
    localStorage.clear();
});

afterEach(() => {
    clearCookie();
});

describe("ThemePicker — follow this device (§5.6, §7.35–§7.39)", () => {
    test("§7.35 systemLabel adds a first option, value system, with its own class hook", async () => {
        render(ThemePicker, { props: withSystem });
        const options = screen.getAllByRole("option", { hidden: true });
        expect(options.map((o) => o.textContent?.trim())).toEqual([
            "Follow this device",
            "Abyss",
            "Dark",
            "Light",
        ]);
        expect(options[0]!.classList.contains("theme-picker-option-system")).toBe(true);
        expect(options[1]!.classList.contains("theme-picker-option-system")).toBe(false);
    });

    test("§7.35 without systemLabel there is no such option", () => {
        render(ThemePicker, { props: base });
        expect(screen.getAllByRole("option", { hidden: true })).toHaveLength(3);
        expect(document.querySelector(".theme-picker-option-system")).toBeNull();
    });

    test("§7.36 with systemLabel and nothing kept, the picker follows the device", async () => {
        const scheme = stubScheme(true);
        const onChange = vi.fn();
        render(ThemePicker, { props: { ...withSystem, onChange } });
        await flush();
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

    test("§7.37 while following, a device switch changes the theme, once", async () => {
        const scheme = stubScheme(false);
        const onChange = vi.fn();
        render(ThemePicker, { props: { ...withSystem, onChange } });
        await flush();
        expect(dataTheme()).toBe("light");
        onChange.mockClear();
        scheme.set(true);
        await flush();
        expect(dataTheme()).toBe("dark");
        expect(onChange).toHaveBeenCalledOnce();
        expect(onChange).toHaveBeenCalledWith("dark", SYSTEM_THEME);
        scheme.restore();
    });

    test("§7.37 choosing a theme stops following the device", async () => {
        const scheme = stubScheme(false);
        render(ThemePicker, { props: withSystem });
        await flush();
        await fireEvent.click(screen.getByRole("button"));
        await fireEvent.click(screen.getByRole("option", { name: "Abyss", hidden: true }));
        await flush();
        expect(dataTheme()).toBe("abyss");
        expect(scheme.listeners.size).toBe(0);
        scheme.set(true);
        await flush();
        expect(dataTheme()).toBe("abyss");
        scheme.restore();
    });

    test("§7.38 systemThemes chooses which themes the device maps to", async () => {
        const scheme = stubScheme(true);
        render(ThemePicker, {
            props: { ...withSystem, systemThemes: { light: "light", dark: "abyss" } },
        });
        await flush();
        expect(dataTheme()).toBe("abyss");
        scheme.restore();
    });

    test("§7.39 the native select variant offers it too, followed by a separator", () => {
        render(ThemePicker, { props: { ...withSystem, variant: "select" } });
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        expect(select.options[0]!.value).toBe(SYSTEM_THEME);
        expect(select.options[0]!.textContent?.trim()).toBe("Follow this device");
        expect(select.querySelector("hr.theme-picker-separator")).toBeTruthy();
    });

    test("resolveTheme maps system by the scheme and leaves a slug alone", () => {
        expect(resolveTheme("system", true)).toBe("dark");
        expect(resolveTheme("system", false)).toBe("light");
        expect(resolveTheme("system", true, { light: "a", dark: "b" })).toBe("b");
        expect(resolveTheme("abyss", true)).toBe("abyss");
    });
});

describe("ThemePicker — kept in a cookie (§5.7, §7.40–§7.43)", () => {
    test("§7.40 a choice is written to the cookie: the choice, not the theme it applies", async () => {
        const scheme = stubScheme(true);
        render(ThemePicker, { props: { ...withSystem, cookieName: "theme" } });
        await flush();
        // The starting choice is not written: a first visit sets no cookie.
        expect(readThemeCookie(document.cookie, "theme")).toBe("");
        await fireEvent.click(screen.getByRole("button"));
        await fireEvent.click(screen.getByRole("option", { name: "Dark", hidden: true }));
        await flush();
        expect(readThemeCookie(document.cookie, "theme")).toBe("dark");
        // Back to following: nothing new is applied on a dark device, but the choice is still kept.
        await fireEvent.click(screen.getByRole("button"));
        await fireEvent.click(
            screen.getByRole("option", { name: "Follow this device", hidden: true }),
        );
        await flush();
        expect(dataTheme()).toBe("dark");
        expect(readThemeCookie(document.cookie, "theme")).toBe(SYSTEM_THEME);
        scheme.restore();
    });

    test("§7.41 the cookie sets the starting choice, above localStorage", async () => {
        document.cookie = themeCookie("theme", "abyss");
        localStorage.setItem("lily-theme", "dark");
        render(ThemePicker, { props: { ...base, cookieName: "theme", storageKey: "lily-theme" } });
        await flush();
        expect(dataTheme()).toBe("abyss");
    });

    test("§7.42 a cookie that is not one of the choices is ignored", async () => {
        document.cookie = themeCookie("theme", "../../evil");
        render(ThemePicker, { props: { ...base, cookieName: "theme" } });
        await flush();
        expect(dataTheme()).toBe("light");
        expect(
            document.head.querySelector("link[data-lily-theme-picker]")!.getAttribute("href"),
        ).toBe("/assets/themes/light.css");
    });

    test("§7.43 themeCookie and readThemeCookie", () => {
        expect(themeCookie("theme", "dark")).toBe(
            `theme=dark; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`,
        );
        expect(themeCookie("theme", "dark", true)).toMatch(/; Secure$/);
        expect(THEME_COOKIE_MAX_AGE).toBe(34_560_000);
        expect(readThemeCookie("a=1; theme=dark; b=2", "theme")).toBe("dark");
        expect(readThemeCookie("a=1; theme=dark", "theme", ["light"])).toBe("");
        expect(readThemeCookie("mytheme=dark", "theme")).toBe("");
        expect(readThemeCookie("theme=%E0%A4%A", "theme")).toBe("");
        expect(readThemeCookie(undefined, "theme")).toBe("");
    });
});

describe("ThemePicker — kept by default (§5.8, §7.44–§7.46)", () => {
    const pick = async (name: string) => {
        await fireEvent.click(screen.getByRole("button"));
        await fireEvent.click(screen.getByRole("option", { name, hidden: true }));
        await flush();
    };

    test("§7.44 with no storageKey or cookieName, a choice is kept in both, under lily-{name}", async () => {
        render(ThemePicker, { props: base });
        await flush();
        await pick("Abyss");
        expect(localStorage.getItem("lily-theme")).toBe("abyss");
        expect(readThemeCookie(document.cookie, "lily-theme")).toBe("abyss");
        document.body.innerHTML = "";
        render(ThemePicker, { props: { ...base, name: "brand" } });
        await flush();
        await pick("Dark");
        expect(localStorage.getItem("lily-brand")).toBe("dark");
        expect(readThemeCookie(document.cookie, "lily-brand")).toBe("dark");
    });

    test("§7.45 the first load stores nothing until the choice changes", async () => {
        render(ThemePicker, { props: withSystem });
        await flush();
        expect(localStorage.length).toBe(0);
        expect(document.cookie).toBe("");
    });

    test("§7.46 an empty string turns either store off", async () => {
        render(ThemePicker, { props: { ...base, storageKey: "", cookieName: "" } });
        await flush();
        await pick("Abyss");
        expect(localStorage.length).toBe(0);
        expect(document.cookie).toBe("");
        document.body.innerHTML = "";
        render(ThemePicker, { props: { ...base, cookieName: "" } });
        await flush();
        await pick("Dark");
        expect(localStorage.getItem("lily-theme")).toBe("dark");
        expect(document.cookie).toBe("");
    });
});
