import { afterEach, describe, expect, test, vi } from "vitest";

import {
    SYSTEM_THEME,
    THEME_COOKIE_MAX_AGE,
    prefersDarkScheme,
    readDocumentThemeCookie,
    readThemeCookie,
    resolveTheme,
    themeChoices,
    themeCookie,
    watchColorScheme,
    writeDocumentThemeCookie,
} from "./theme-choice";

// The theme-picker's "Follow this device" choice and its cookie (spec/theme-picker, 2026-11-16).

const originalMatchMedia = Object.getOwnPropertyDescriptor(window, "matchMedia");
const originalLocation = Object.getOwnPropertyDescriptor(window, "location");

function setMatchMedia(value: unknown) {
    Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value });
}

afterEach(() => {
    vi.restoreAllMocks();
    if (originalMatchMedia) Object.defineProperty(window, "matchMedia", originalMatchMedia);
    else delete (window as { matchMedia?: unknown }).matchMedia;
    if (originalLocation) Object.defineProperty(window, "location", originalLocation);
    document.cookie = "theme=; Path=/; Max-Age=0";
});

function media(matches: boolean, queries: string[] = []) {
    return (q: string) => {
        queries.push(q);
        return { matches, media: q, addEventListener: vi.fn(), removeEventListener: vi.fn() };
    };
}

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

    // Found by bin/mutation-test (tasks.md P35-T3).
    test("prefersDarkScheme asks the dark query, and is false without matchMedia", () => {
        const queries: string[] = [];
        setMatchMedia(media(true, queries));
        expect(prefersDarkScheme()).toBe(true);
        expect(queries).toEqual(["(prefers-color-scheme: dark)"]);
        setMatchMedia(media(false));
        expect(prefersDarkScheme()).toBe(false);
        setMatchMedia(undefined);
        expect(prefersDarkScheme()).toBe(false);
    });

    test("watchColorScheme listens to the dark query's change event, and is a no-op without matchMedia", () => {
        const add = vi.fn();
        const remove = vi.fn();
        const queries: string[] = [];
        setMatchMedia((q: string) => {
            queries.push(q);
            return { matches: false, addEventListener: add, removeEventListener: remove };
        });
        const stop = watchColorScheme(() => {});
        expect(queries).toEqual(["(prefers-color-scheme: dark)"]);
        expect(add.mock.calls[0][0]).toBe("change");
        stop();
        expect(remove.mock.calls[0][0]).toBe("change");
        expect(remove.mock.calls[0][1]).toBe(add.mock.calls[0][1]);
        setMatchMedia(undefined);
        expect(() => watchColorScheme(() => {})()).not.toThrow();
        // An old Safari MediaQueryList has no addEventListener: nothing is attached, and nothing throws.
        setMatchMedia(() => ({ matches: false }));
        expect(() => watchColorScheme(() => {})()).not.toThrow();
    });

    test("readThemeCookie splits on the first =, ignores a part with none, and trims", () => {
        expect(readThemeCookie("theme=a=b", "theme")).toBe("a=b");
        expect(readThemeCookie("junk; theme=dark", "theme")).toBe("dark");
        expect(readThemeCookie("=dark; theme= light ", "theme")).toBe("light");
        expect(readThemeCookie("theme=%20dark", "theme")).toBe(" dark");
    });

    // Some test environments (Angular's) make window.location fixed; there the https case cannot be staged.
    const locationConfigurable =
        Object.getOwnPropertyDescriptor(window, "location")?.configurable !== false;
    test.runIf(locationConfigurable)(
        "writeDocumentThemeCookie marks the cookie Secure only on https",
        () => {
            const writes: string[] = [];
            vi.spyOn(document, "cookie", "set").mockImplementation((v: string) => {
                writes.push(v);
            });
            writeDocumentThemeCookie("theme", "dark");
            expect(writes[0]).toBe(themeCookie("theme", "dark"));
            Object.defineProperty(window, "location", {
                configurable: true,
                value: { protocol: "https:" },
            });
            writeDocumentThemeCookie("theme", "dark");
            expect(writes[1]).toBe(themeCookie("theme", "dark", true));
        },
    );

    test("a document that refuses cookies reads as none and ignores a write", () => {
        vi.spyOn(document, "cookie", "get").mockImplementation(() => {
            throw new Error("SecurityError");
        });
        vi.spyOn(document, "cookie", "set").mockImplementation(() => {
            throw new Error("SecurityError");
        });
        expect(readDocumentThemeCookie("theme", ["dark"])).toBe("");
        expect(() => writeDocumentThemeCookie("theme", "dark")).not.toThrow();
    });
});
