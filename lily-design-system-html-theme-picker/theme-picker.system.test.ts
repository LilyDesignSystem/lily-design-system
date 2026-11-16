import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { ThemePicker } from "./theme-picker.js";
import { SYSTEM_THEME, readThemeCookie, themeCookie } from "./theme-choice.js";

// spec §5.6 "Follow this device" and §5.7 the theme cookie (ported from the Svelte reference, 2026-11-16).

if (!customElements.get("theme-picker")) customElements.define("theme-picker", ThemePicker);

const BASE = { label: "Theme", "themes-url": "/assets/themes/", themes: "light,dark,abyss" };
const SYSTEM = { ...BASE, "system-label": "Follow this device" };

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
            for (const fn of listeners) fn({ matches: next });
        },
        listeners,
        restore() {
            window.matchMedia = original;
        },
    };
}

function mount(attrs: Record<string, string>): ThemePicker {
    const el = document.createElement("theme-picker") as ThemePicker;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.body.appendChild(el);
    return el;
}

const dataTheme = () => document.documentElement.getAttribute("data-theme");
const clearCookie = () => (document.cookie = "theme=; Path=/; Max-Age=0");
const optionNamed = (name: string) =>
    [...document.querySelectorAll<HTMLElement>(".theme-picker-option")].find(
        (o) => o.textContent?.trim() === name,
    )!;

function choose(name: string) {
    (document.querySelector(".theme-picker-button") as HTMLButtonElement).click();
    optionNamed(name).click();
}

beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.head.querySelectorAll("link[data-lily-theme-picker]").forEach((n) => n.remove());
    clearCookie();
    localStorage.clear();
});

afterEach(() => {
    document.body.innerHTML = "";
    clearCookie();
});

describe("<theme-picker> — follow this device (§5.6, §7.35–§7.39)", () => {
    test("§7.35 system-label adds a first option, value system, with its own class hook", () => {
        mount(SYSTEM);
        const options = [...document.querySelectorAll(".theme-picker-option")];
        expect(options.map((o) => o.textContent)).toEqual([
            "Follow this device",
            "Light",
            "Dark",
            "Abyss",
        ]);
        expect(options[0]!.classList.contains("theme-picker-option-system")).toBe(true);
        expect(options[1]!.classList.contains("theme-picker-option-system")).toBe(false);
    });

    test("§7.35 without system-label there is no such option", () => {
        mount(BASE);
        expect(document.querySelectorAll(".theme-picker-option")).toHaveLength(3);
        expect(document.querySelector(".theme-picker-option-system")).toBeNull();
    });

    test("§7.36 with system-label and nothing kept, the picker follows the device", () => {
        const scheme = stubScheme(true);
        const el = mount(SYSTEM);
        expect(dataTheme()).toBe("dark");
        expect(el.value).toBe(SYSTEM_THEME);
        expect((document.querySelector("input[type=hidden]") as HTMLInputElement).value).toBe(
            SYSTEM_THEME,
        );
        expect(optionNamed("Follow this device").getAttribute("aria-selected")).toBe("true");
        scheme.restore();
    });

    test("§7.37 while following, a device switch changes the theme, once", () => {
        const scheme = stubScheme(false);
        const el = mount(SYSTEM);
        expect(dataTheme()).toBe("light");
        const details: unknown[] = [];
        el.addEventListener("themechange", (e) => details.push((e as CustomEvent).detail));
        scheme.set(true);
        expect(dataTheme()).toBe("dark");
        expect(details).toEqual([{ theme: "dark", choice: SYSTEM_THEME }]);
        scheme.restore();
    });

    test("§7.37 choosing a theme stops following the device", () => {
        const scheme = stubScheme(false);
        mount(SYSTEM);
        choose("Abyss");
        expect(dataTheme()).toBe("abyss");
        expect(scheme.listeners.size).toBe(0);
        scheme.set(true);
        expect(dataTheme()).toBe("abyss");
        scheme.restore();
    });

    test("§7.37 disconnecting stops following the device", () => {
        const scheme = stubScheme(false);
        const el = mount(SYSTEM);
        expect(scheme.listeners.size).toBe(1);
        el.remove();
        expect(scheme.listeners.size).toBe(0);
        scheme.restore();
    });

    test("§7.38 system-themes chooses which themes the device maps to", () => {
        const scheme = stubScheme(true);
        mount({ ...SYSTEM, "system-themes": "light,abyss" });
        expect(dataTheme()).toBe("abyss");
        scheme.restore();
    });

    test("§7.39 the native select variant offers it too, followed by a separator", () => {
        mount({ ...SYSTEM, variant: "select" });
        const select = document.querySelector("select") as HTMLSelectElement;
        expect(select.options[0]!.value).toBe(SYSTEM_THEME);
        expect(select.options[0]!.textContent).toBe("Follow this device");
        expect(select.querySelector("hr.theme-picker-separator")).toBeTruthy();
    });
});

describe("<theme-picker> — kept in a cookie (§5.7, §7.40–§7.42)", () => {
    test("§7.40 a choice is written to the cookie: the choice, not the theme it applies", () => {
        const scheme = stubScheme(true);
        mount({ ...SYSTEM, "cookie-name": "theme" });
        expect(readThemeCookie(document.cookie, "theme")).toBe(SYSTEM_THEME);
        choose("Dark");
        expect(readThemeCookie(document.cookie, "theme")).toBe("dark");
        choose("Follow this device");
        expect(dataTheme()).toBe("dark");
        expect(readThemeCookie(document.cookie, "theme")).toBe(SYSTEM_THEME);
        scheme.restore();
    });

    test("§7.41 the cookie sets the starting choice, above localStorage", () => {
        document.cookie = themeCookie("theme", "abyss");
        localStorage.setItem("lily-theme", "dark");
        mount({ ...BASE, "cookie-name": "theme", "storage-key": "lily-theme" });
        expect(dataTheme()).toBe("abyss");
    });

    test("§7.42 a cookie that is not one of the choices is ignored", () => {
        document.cookie = themeCookie("theme", "../../evil");
        mount({ ...BASE, "cookie-name": "theme" });
        expect(dataTheme()).toBe("light");
        expect(
            document.head.querySelector("link[data-lily-theme-picker]")!.getAttribute("href"),
        ).toBe("/assets/themes/light.css");
    });
});
