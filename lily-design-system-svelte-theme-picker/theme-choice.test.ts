import { afterEach, describe, expect, test } from "vitest";

import {
    SYSTEM_THEME,
    THEME_COOKIE_MAX_AGE,
    readDocumentThemeCookie,
    readThemeCookie,
    resolveTheme,
    themeChoices,
    themeCookie,
    watchColorScheme,
    writeDocumentThemeCookie,
} from "./theme-choice";

// The theme-picker's "Follow this device" choice and its cookie (spec/theme-picker, 2026-11-16).

afterEach(() => {
    document.cookie = "theme=; Path=/; Max-Age=0";
});

describe("theme-choice", () => {
    test("resolveTheme maps system by the scheme and leaves a slug alone", () => {
        expect(resolveTheme(SYSTEM_THEME, true)).toBe("dark");
        expect(resolveTheme(SYSTEM_THEME, false)).toBe("light");
        expect(resolveTheme(SYSTEM_THEME, true, { light: "a", dark: "b" })).toBe("b");
        expect(resolveTheme("abyss", true)).toBe("abyss");
    });

    test("themeChoices puts system first only when it has a label", () => {
        expect(themeChoices(["light", "dark"], "Follow this device")).toEqual([
            SYSTEM_THEME,
            "light",
            "dark",
        ]);
        expect(themeChoices(["light", "dark"])).toEqual(["light", "dark"]);
    });

    test("themeCookie writes Path, 400 days, SameSite=Lax and Secure when asked", () => {
        expect(themeCookie("theme", "dark")).toBe(
            `theme=dark; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`,
        );
        expect(themeCookie("theme", "dark", true)).toMatch(/; Secure$/);
        expect(THEME_COOKIE_MAX_AGE).toBe(34_560_000);
    });

    test("readThemeCookie finds, decodes and checks", () => {
        expect(readThemeCookie("a=1; theme=dark; b=2", "theme")).toBe("dark");
        expect(readThemeCookie("a=1; theme=dark", "theme", ["light"])).toBe("");
        expect(readThemeCookie("mytheme=dark", "theme")).toBe("");
        expect(readThemeCookie("theme=%E0%A4%A", "theme")).toBe("");
        expect(readThemeCookie(undefined, "theme")).toBe("");
    });

    test("the document cookie round-trips, checked against the choices", () => {
        writeDocumentThemeCookie("theme", SYSTEM_THEME);
        expect(readDocumentThemeCookie("theme", [SYSTEM_THEME, "light"])).toBe(SYSTEM_THEME);
        expect(readDocumentThemeCookie("theme", ["light"])).toBe("");
    });

    test("watchColorScheme reports a change and stops when asked", () => {
        const original = window.matchMedia;
        const listeners = new Set<(e: { matches: boolean }) => void>();
        window.matchMedia = ((q: string) => ({
            matches: false,
            media: q,
            addEventListener: (_: string, fn: (e: { matches: boolean }) => void) =>
                listeners.add(fn),
            removeEventListener: (_: string, fn: (e: { matches: boolean }) => void) =>
                listeners.delete(fn),
        })) as unknown as typeof window.matchMedia;
        const seen: boolean[] = [];
        const stop = watchColorScheme((dark) => seen.push(dark));
        for (const fn of listeners) fn({ matches: true });
        expect(seen).toEqual([true]);
        stop();
        expect(listeners.size).toBe(0);
        window.matchMedia = original;
    });
});
