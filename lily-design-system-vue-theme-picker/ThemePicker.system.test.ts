import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";

import ThemePicker from "./ThemePicker.vue";
import { SYSTEM_THEME, readThemeCookie, themeCookie } from "./theme-choice";

// spec §5.6 "Follow this device" and §5.7 the theme cookie (ported from the Svelte reference, 2026-11-16).

const THEMES = ["light", "dark", "abyss"];
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
            for (const fn of listeners) fn({ matches: next });
        },
        listeners,
        restore() {
            window.matchMedia = original;
        },
    };
}

async function flush(): Promise<void> {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
}

const wrappers: VueWrapper<any>[] = [];
function build(props: Record<string, unknown>) {
    const w = mount(ThemePicker, { props, attachTo: document.body });
    wrappers.push(w);
    return w;
}

const dataTheme = () => document.documentElement.getAttribute("data-theme");
const clearCookie = () => (document.cookie = "theme=; Path=/; Max-Age=0");
const optionNamed = (name: string) =>
    [...document.querySelectorAll<HTMLElement>(".theme-picker-option")].find(
        (o) => o.textContent?.trim() === name,
    )!;

async function choose(name: string) {
    (document.querySelector(".theme-picker-button") as HTMLButtonElement).click();
    await flush();
    optionNamed(name).click();
    await flush();
}

beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.head.querySelectorAll("link[data-lily-theme-picker]").forEach((n) => n.remove());
    clearCookie();
    localStorage.clear();
});

afterEach(() => {
    while (wrappers.length) wrappers.pop()!.unmount();
    clearCookie();
});

describe("ThemePicker — follow this device (§5.6, §7.35–§7.39)", () => {
    test("§7.35 systemLabel adds a first option, value system, with its own class hook", async () => {
        build(withSystem);
        await flush();
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
        build(base);
        await flush();
        expect(document.querySelectorAll(".theme-picker-option")).toHaveLength(3);
        expect(document.querySelector(".theme-picker-option-system")).toBeNull();
    });

    test("§7.36 with systemLabel and nothing kept, the picker follows the device", async () => {
        const scheme = stubScheme(true);
        const w = build(withSystem);
        await flush();
        expect(dataTheme()).toBe("dark");
        expect((document.querySelector("input[type=hidden]") as HTMLInputElement).value).toBe(
            SYSTEM_THEME,
        );
        expect(optionNamed("Follow this device").getAttribute("aria-selected")).toBe("true");
        expect(w.emitted("change")?.at(-1)).toEqual(["dark", SYSTEM_THEME]);
        expect(w.emitted("update:value")?.at(-1)).toEqual([SYSTEM_THEME]);
        scheme.restore();
    });

    test("§7.37 while following, a device switch changes the theme, once", async () => {
        const scheme = stubScheme(false);
        const w = build(withSystem);
        await flush();
        expect(dataTheme()).toBe("light");
        const before = (w.emitted("change") ?? []).length;
        scheme.set(true);
        await flush();
        expect(dataTheme()).toBe("dark");
        expect((w.emitted("change") ?? []).slice(before)).toEqual([["dark", SYSTEM_THEME]]);
        scheme.restore();
    });

    test("§7.37 choosing a theme stops following the device", async () => {
        const scheme = stubScheme(false);
        build(withSystem);
        await flush();
        await choose("Abyss");
        expect(dataTheme()).toBe("abyss");
        expect(scheme.listeners.size).toBe(0);
        scheme.set(true);
        await flush();
        expect(dataTheme()).toBe("abyss");
        scheme.restore();
    });

    test("§7.37 with v-model:value the bound value is the choice, and it keeps following", async () => {
        const scheme = stubScheme(false);
        const value = ref(SYSTEM_THEME);
        const Host = defineComponent(
            () => () =>
                h(ThemePicker, {
                    ...withSystem,
                    value: value.value,
                    "onUpdate:value": (v: string) => (value.value = v),
                }),
        );
        wrappers.push(mount(Host, { attachTo: document.body }));
        await flush();
        expect(dataTheme()).toBe("light");
        scheme.set(true);
        await flush();
        expect(dataTheme()).toBe("dark");
        expect(value.value).toBe(SYSTEM_THEME);
        scheme.restore();
    });

    test("§7.38 systemThemes chooses which themes the device maps to", async () => {
        const scheme = stubScheme(true);
        build({ ...withSystem, systemThemes: { light: "light", dark: "abyss" } });
        await flush();
        expect(dataTheme()).toBe("abyss");
        scheme.restore();
    });

    test("§7.39 the native select variant offers it too, followed by a separator", async () => {
        build({ ...withSystem, variant: "select" });
        await flush();
        const select = document.querySelector("select") as HTMLSelectElement;
        expect(select.options[0]!.value).toBe(SYSTEM_THEME);
        expect(select.options[0]!.textContent?.trim()).toBe("Follow this device");
        expect(select.querySelector("hr.theme-picker-separator")).toBeTruthy();
    });
});

describe("ThemePicker — kept in a cookie (§5.7, §7.40–§7.42)", () => {
    test("§7.40 a choice is written to the cookie: the choice, not the theme it applies", async () => {
        const scheme = stubScheme(true);
        build({ ...withSystem, cookieName: "theme" });
        await flush();
        expect(readThemeCookie(document.cookie, "theme")).toBe(SYSTEM_THEME);
        await choose("Dark");
        expect(readThemeCookie(document.cookie, "theme")).toBe("dark");
        await choose("Follow this device");
        expect(dataTheme()).toBe("dark");
        expect(readThemeCookie(document.cookie, "theme")).toBe(SYSTEM_THEME);
        scheme.restore();
    });

    test("§7.41 the cookie sets the starting choice, above localStorage", async () => {
        document.cookie = themeCookie("theme", "abyss");
        localStorage.setItem("lily-theme", "dark");
        build({ ...base, cookieName: "theme", storageKey: "lily-theme" });
        await flush();
        expect(dataTheme()).toBe("abyss");
    });

    test("§7.42 a cookie that is not one of the choices is ignored", async () => {
        document.cookie = themeCookie("theme", "../../evil");
        build({ ...base, cookieName: "theme" });
        await flush();
        expect(dataTheme()).toBe("light");
        expect(
            document.head.querySelector("link[data-lily-theme-picker]")!.getAttribute("href"),
        ).toBe("/assets/themes/light.css");
    });
});
