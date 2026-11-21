// The theme-picker's "Follow this device" choice and its cookie (spec/theme-picker, 2026-11-16). Pure and
// framework-neutral; copied into each TypeScript theme-picker by bin/sync-shared-modules (Nunjucks gets the
// types-stripped .js). The Blazor picker has its own C# version.

/** The value of the option that follows the device's colour scheme. */
export const SYSTEM_THEME = "system";

/** The light and dark themes the "system" choice applies. */
export type SystemThemes = { light: string; dark: string };

export const DEFAULT_SYSTEM_THEMES: SystemThemes = { light: "light", dark: "dark" };

const DARK_QUERY = "(prefers-color-scheme: dark)";

/** Does the device ask for a dark colour scheme? False under SSR or without matchMedia. */
export function prefersDarkScheme(): boolean {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia(DARK_QUERY).matches;
}

/**
 * Calls `onChange(dark)` whenever the device's colour scheme changes, and returns the function that stops it. A no-op
 * under SSR or without matchMedia.
 */
export function watchColorScheme(onChange: (dark: boolean) => void): () => void {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => {};
    const query = window.matchMedia(DARK_QUERY);
    const listener = (event: { matches: boolean }): void => onChange(event.matches);
    query.addEventListener?.("change", listener);
    return () => query.removeEventListener?.("change", listener);
}

/** The theme a choice applies: "system" becomes `systemThemes.dark` or `.light` by `prefersDark`; a slug is itself. */
export function resolveTheme(
    choice: string,
    prefersDark: boolean,
    systemThemes: SystemThemes = DEFAULT_SYSTEM_THEMES,
): string {
    if (choice !== SYSTEM_THEME) return choice;
    return prefersDark ? systemThemes.dark : systemThemes.light;
}

/** The language of the page (`<html lang>`), else English: the language the theme names are sorted in. */
export function pageLanguage(): string {
    return (typeof document !== "undefined" && document.documentElement.lang) || "en";
}

/**
 * The themes in alphabetical order of the name the reader sees (`labelOf`), in one list: not by slug, and not grouped by kind.
 * Compared with `Intl.Collator` for `locale` (else English), ignoring case and accents and reading numbers as numbers, so
 * "Theme 2" comes before "Theme 10". Names that compare equal are ordered by slug, so the order is the same on every render.
 * A `locale` the platform does not understand falls back to English. Returns a new array.
 */
export function sortThemes(
    themes: readonly string[],
    labelOf: (theme: string) => string,
    locale?: string,
): string[] {
    const options = { sensitivity: "base", numeric: true } as const;
    let collator: Intl.Collator;
    try {
        collator = new Intl.Collator(locale || "en", options);
    } catch {
        collator = new Intl.Collator("en", options);
    }
    return [...themes].sort(
        (a, b) => collator.compare(labelOf(a), labelOf(b)) || (a < b ? -1 : a > b ? 1 : 0),
    );
}

/** The choices a picker offers: "system" first when it has a label, then the themes. */
export function themeChoices(themes: readonly string[], systemLabel?: string): string[] {
    return systemLabel ? [SYSTEM_THEME, ...themes] : [...themes];
}

/** 400 days, the longest a browser keeps a cookie (RFC 6265bis). */
export const THEME_COOKIE_MAX_AGE = 400 * 24 * 60 * 60;

/**
 * Read the theme cookie from a `Cookie` header or `document.cookie`. Returns "" when it is absent, cannot be decoded,
 * or `allowed` is given and does not hold it: never trust a cookie into a stylesheet URL unchecked.
 */
export function readThemeCookie(
    cookies: string | null | undefined,
    name: string,
    allowed?: readonly string[],
): string {
    for (const part of (cookies ?? "").split(";")) {
        const eq = part.indexOf("=");
        if (eq < 0 || part.slice(0, eq).trim() !== name) continue;
        let value = part.slice(eq + 1).trim();
        try {
            value = decodeURIComponent(value);
        } catch {
            return "";
        }
        return !allowed || allowed.includes(value) ? value : "";
    }
    return "";
}

/** The `document.cookie` (or `Set-Cookie`) string that keeps a theme choice. */
export function themeCookie(name: string, value: string, secure = false): string {
    return (
        `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax` +
        (secure ? "; Secure" : "")
    );
}

/** Read the choice from `document.cookie`, checked against `allowed`; "" under SSR or when cookies are refused. */
export function readDocumentThemeCookie(name: string, allowed: readonly string[]): string {
    try {
        return typeof document === "undefined"
            ? ""
            : readThemeCookie(document.cookie, name, allowed);
    } catch {
        return "";
    }
}

/** Write the choice to `document.cookie`, `Secure` on an https page. Ignores a document that refuses cookies. */
export function writeDocumentThemeCookie(name: string, value: string): void {
    try {
        if (typeof document === "undefined") return;
        document.cookie = themeCookie(name, value, window.location?.protocol === "https:");
    } catch {
        // ignore: a sandboxed document may refuse cookies
    }
}
