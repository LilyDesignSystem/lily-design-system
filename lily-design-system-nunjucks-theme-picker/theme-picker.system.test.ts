// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { initThemePicker } from "./theme-picker.client.js";
import { SYSTEM_THEME, readThemeCookie, themeCookie } from "./theme-choice.js";

// spec §5.6 "Follow this device" and §5.7 the theme cookie (ported from the Svelte reference, 2026-11-16).

const env = nunjucks.configure(path.dirname(fileURLToPath(import.meta.url)), {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true,
});

const BASE = { label: "Theme", themesUrl: "/assets/themes/", themes: ["light", "dark", "abyss"] };
const SYSTEM = { ...BASE, systemLabel: "Follow this device" };

function render(opts: Record<string, unknown>): string {
    return env.renderString(
        `{% from "./theme-picker.njk" import themePicker %}{{ themePicker(opts) }}`,
        { opts },
    );
}

const controllers: { destroy: () => void }[] = [];
function setup(opts: Record<string, unknown>, initOpts: Record<string, unknown> = {}) {
    document.body.innerHTML = render(opts);
    const root = document.querySelector("[data-lily-theme-picker-root]") as HTMLElement;
    const controller = initThemePicker(root, initOpts);
    controllers.push(controller);
    return { root, controller };
}

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
    while (controllers.length) controllers.pop()!.destroy();
    document.body.innerHTML = "";
    clearCookie();
});

describe("themePicker — follow this device (§5.6, §7.35–§7.39)", () => {
    test("§7.35 systemLabel renders a first option, value system, with its own class hook", () => {
        document.body.innerHTML = render(SYSTEM);
        const options = [...document.querySelectorAll(".theme-picker-option")];
        expect(options.map((o) => o.textContent?.trim())).toEqual([
            "Follow this device",
            "Abyss",
            "Dark",
            "Light",
        ]);
        expect(options[0]!.getAttribute("data-value")).toBe(SYSTEM_THEME);
        expect(options[0]!.classList.contains("theme-picker-option-system")).toBe(true);
        expect(options[1]!.classList.contains("theme-picker-option-system")).toBe(false);
    });

    test("§7.35 without systemLabel there is no such option", () => {
        document.body.innerHTML = render(BASE);
        expect(document.querySelectorAll(".theme-picker-option")).toHaveLength(3);
        expect(document.querySelector(".theme-picker-option-system")).toBeNull();
    });

    test("§7.36 the server marks system selected, and the client follows the device", () => {
        document.body.innerHTML = render(SYSTEM);
        expect(optionNamed("Follow this device").getAttribute("aria-selected")).toBe("true");
        expect(
            (document.querySelector("[data-lily-theme-picker-input]") as HTMLInputElement).value,
        ).toBe(SYSTEM_THEME);
        const scheme = stubScheme(true);
        const onChange = vi.fn();
        setup(SYSTEM, { onChange });
        expect(dataTheme()).toBe("dark");
        expect(onChange).toHaveBeenLastCalledWith("dark", SYSTEM_THEME);
        scheme.restore();
    });

    test("§7.37 while following, a device switch changes the theme, once", () => {
        const scheme = stubScheme(false);
        const onChange = vi.fn();
        setup(SYSTEM, { onChange });
        expect(dataTheme()).toBe("light");
        onChange.mockClear();
        scheme.set(true);
        expect(dataTheme()).toBe("dark");
        expect(onChange.mock.calls).toEqual([["dark", SYSTEM_THEME]]);
        scheme.restore();
    });

    test("§7.37 choosing a theme, or destroy(), stops following the device", () => {
        const scheme = stubScheme(false);
        const { controller } = setup(SYSTEM);
        choose("Abyss");
        expect(dataTheme()).toBe("abyss");
        expect(scheme.listeners.size).toBe(0);
        choose("Follow this device");
        expect(scheme.listeners.size).toBe(1);
        controller.destroy();
        expect(scheme.listeners.size).toBe(0);
        scheme.restore();
    });

    test("§7.38 systemThemes chooses which themes the device maps to", () => {
        const scheme = stubScheme(true);
        setup({ ...SYSTEM, systemThemes: { light: "light", dark: "abyss" } });
        expect(dataTheme()).toBe("abyss");
        scheme.restore();
    });

    test("§7.39 the native select variant offers it too, followed by a separator", () => {
        const scheme = stubScheme(true);
        setup({ ...SYSTEM, variant: "select" });
        const select = document.querySelector("select") as HTMLSelectElement;
        expect(select.options[0]!.value).toBe(SYSTEM_THEME);
        expect(select.options[0]!.textContent?.trim()).toBe("Follow this device");
        expect(select.querySelector("hr.theme-picker-separator")).toBeTruthy();
        expect(dataTheme()).toBe("dark");
        scheme.restore();
    });
});

describe("themePicker — kept in a cookie (§5.7, §7.40–§7.42)", () => {
    test("§7.40 a choice is written to the cookie: the choice, not the theme it applies", () => {
        const scheme = stubScheme(true);
        setup({ ...SYSTEM, cookieName: "theme" });
        // The starting choice is not written: a first visit sets no cookie.
        expect(readThemeCookie(document.cookie, "theme")).toBe("");
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
        setup({ ...BASE, cookieName: "theme", storageKey: "lily-theme" });
        expect(dataTheme()).toBe("abyss");
    });

    test("§7.42 a cookie that is not one of the choices is ignored", () => {
        document.cookie = themeCookie("theme", "../../evil");
        setup({ ...BASE, cookieName: "theme" });
        expect(dataTheme()).toBe("light");
        expect(
            document.head.querySelector("link[data-lily-theme-picker]")!.getAttribute("href"),
        ).toBe("/assets/themes/light.css");
    });

    test("§7.41 a server passes the cookie back as value, and the macro renders it selected", () => {
        const kept = readThemeCookie("theme=dark", "theme", [SYSTEM_THEME, ...BASE.themes]);
        document.body.innerHTML = render({ ...SYSTEM, value: kept });
        expect(optionNamed("Dark").getAttribute("aria-selected")).toBe("true");
        expect(optionNamed("Follow this device").getAttribute("aria-selected")).toBe("false");
    });
});

describe("themePicker — kept by default (§5.8, §7.44–§7.46)", () => {
    test("§7.44 with no storageKey or cookieName, a choice is kept in localStorage under lily-{name} and sets no cookie (P41-T5c)", () => {
        setup(BASE);
        choose("Abyss");
        expect(localStorage.getItem("lily-theme")).toBe("abyss");
        expect(document.cookie).toBe("");
        controllers.pop()!.destroy();
        setup({ ...BASE, name: "brand" });
        choose("Dark");
        expect(localStorage.getItem("lily-brand")).toBe("dark");
        expect(document.cookie).toBe("");
    });

    test("§7.45 the first load stores nothing until the choice changes", () => {
        setup(SYSTEM);
        expect(localStorage.length).toBe(0);
        expect(document.cookie).toBe("");
    });

    test("§7.46 an empty string turns either store off", () => {
        setup({ ...BASE, storageKey: "", cookieName: "" });
        choose("Abyss");
        expect(localStorage.length).toBe(0);
        expect(document.cookie).toBe("");
        controllers.pop()!.destroy();
        setup({ ...BASE, cookieName: "" });
        choose("Dark");
        expect(localStorage.getItem("lily-theme")).toBe("dark");
        expect(document.cookie).toBe("");
    });
});
