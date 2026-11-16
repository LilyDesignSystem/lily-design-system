import { ComponentFixture, TestBed } from "@angular/core/testing";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { ThemePicker } from "./theme-picker.component";
import { SYSTEM_THEME, readThemeCookie, themeCookie } from "./theme-choice";

// spec §5.6 "Follow this device" and §5.7 the theme cookie (ported from the Svelte reference, 2026-11-16).

const THEMES = ["light", "dark", "abyss"];
const SYSTEM_LABEL = { systemLabel: "Follow this device" };

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

let fixtures: ComponentFixture<ThemePicker>[] = [];

async function mount(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Theme");
    fixture.componentRef.setInput("themesUrl", "/assets/themes/");
    fixture.componentRef.setInput("themes", THEMES);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    document.body.appendChild(fixture.nativeElement);
    fixtures.push(fixture);
    await settle(fixture);
    return fixture;
}

async function settle(fixture: ComponentFixture<ThemePicker>) {
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
}

const dataTheme = () => document.documentElement.getAttribute("data-theme");
const clearCookie = () => (document.cookie = "theme=; Path=/; Max-Age=0");
const optionNamed = (name: string) =>
    [...document.querySelectorAll<HTMLElement>(".theme-picker-option")].find(
        (o) => o.textContent?.trim() === name,
    )!;

async function choose(fixture: ComponentFixture<ThemePicker>, name: string) {
    (document.querySelector(".theme-picker-button") as HTMLButtonElement).click();
    await settle(fixture);
    optionNamed(name).click();
    await settle(fixture);
}

beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.head.querySelectorAll("link[data-lily-theme-picker]").forEach((n) => n.remove());
    clearCookie();
    localStorage.clear();
});

afterEach(() => {
    for (const f of fixtures) f.destroy();
    fixtures = [];
    document.body.innerHTML = "";
    clearCookie();
});

describe("ThemePicker — follow this device (§5.6, §7.35–§7.39)", () => {
    test("§7.35 systemLabel adds a first option, value system, with its own class hook", async () => {
        await mount(SYSTEM_LABEL);
        const options = [...document.querySelectorAll(".theme-picker-option")];
        expect(options.map((o) => o.textContent?.trim())).toEqual([
            "Follow this device",
            "Light",
            "Dark",
            "Abyss",
        ]);
        expect(options[0]!.classList.contains("theme-picker-option-system")).toBe(true);
        expect(options[1]!.classList.contains("theme-picker-option-system")).toBe(false);
    });

    test("§7.35 without systemLabel there is no such option", async () => {
        await mount();
        expect(document.querySelectorAll(".theme-picker-option")).toHaveLength(3);
        expect(document.querySelector(".theme-picker-option-system")).toBeNull();
    });

    test("§7.36 with systemLabel and nothing kept, the picker follows the device", async () => {
        const scheme = stubScheme(true);
        const fixture = await mount(SYSTEM_LABEL);
        expect(dataTheme()).toBe("dark");
        expect(fixture.componentInstance.value()).toBe(SYSTEM_THEME);
        expect((document.querySelector("input[type=hidden]") as HTMLInputElement).value).toBe(
            SYSTEM_THEME,
        );
        expect(optionNamed("Follow this device").getAttribute("aria-selected")).toBe("true");
        scheme.restore();
    });

    test("§7.37 while following, a device switch changes the theme, once", async () => {
        const scheme = stubScheme(false);
        const fixture = await mount(SYSTEM_LABEL);
        expect(dataTheme()).toBe("light");
        const changed = vi.fn();
        fixture.componentInstance.themeChange.subscribe(changed);
        scheme.set(true);
        await settle(fixture);
        expect(dataTheme()).toBe("dark");
        expect(changed).toHaveBeenCalledOnce();
        expect(changed).toHaveBeenCalledWith("dark");
        expect(fixture.componentInstance.value()).toBe(SYSTEM_THEME);
        scheme.restore();
    });

    test("§7.37 choosing a theme stops following the device", async () => {
        const scheme = stubScheme(false);
        const fixture = await mount(SYSTEM_LABEL);
        await choose(fixture, "Abyss");
        expect(dataTheme()).toBe("abyss");
        expect(scheme.listeners.size).toBe(0);
        scheme.set(true);
        await settle(fixture);
        expect(dataTheme()).toBe("abyss");
        scheme.restore();
    });

    test("§7.38 systemThemes chooses which themes the device maps to", async () => {
        const scheme = stubScheme(true);
        await mount({ ...SYSTEM_LABEL, systemThemes: { light: "light", dark: "abyss" } });
        expect(dataTheme()).toBe("abyss");
        scheme.restore();
    });

    test("§7.39 the native select variant offers it too, followed by a separator", async () => {
        await mount({ ...SYSTEM_LABEL, variant: "select" });
        const select = document.querySelector("select") as HTMLSelectElement;
        expect(select.options[0]!.value).toBe(SYSTEM_THEME);
        expect(select.options[0]!.textContent?.trim()).toBe("Follow this device");
        expect(select.querySelector("hr.theme-picker-separator")).toBeTruthy();
    });
});

describe("ThemePicker — kept in a cookie (§5.7, §7.40–§7.42)", () => {
    test("§7.40 a choice is written to the cookie: the choice, not the theme it applies", async () => {
        const scheme = stubScheme(true);
        const fixture = await mount({ ...SYSTEM_LABEL, cookieName: "theme" });
        expect(readThemeCookie(document.cookie, "theme")).toBe(SYSTEM_THEME);
        await choose(fixture, "Dark");
        expect(readThemeCookie(document.cookie, "theme")).toBe("dark");
        await choose(fixture, "Follow this device");
        expect(dataTheme()).toBe("dark");
        expect(readThemeCookie(document.cookie, "theme")).toBe(SYSTEM_THEME);
        scheme.restore();
    });

    test("§7.41 the cookie sets the starting choice, above localStorage", async () => {
        document.cookie = themeCookie("theme", "abyss");
        localStorage.setItem("lily-theme", "dark");
        await mount({ cookieName: "theme", storageKey: "lily-theme" });
        expect(dataTheme()).toBe("abyss");
    });

    test("§7.42 a cookie that is not one of the choices is ignored", async () => {
        document.cookie = themeCookie("theme", "../../evil");
        await mount({ cookieName: "theme" });
        expect(dataTheme()).toBe("light");
        expect(
            document.head.querySelector("link[data-lily-theme-picker]")!.getAttribute("href"),
        ).toBe("/assets/themes/light.css");
    });
});
