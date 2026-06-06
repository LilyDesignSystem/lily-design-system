"use client";

/*
    Next.js App Router — `app/page.tsx` (CLIENT component).

    Renders the ThemePicker. The initial theme comes from a parent
    server component (see layout.tsx) via the `data-initial-theme`
    attribute on a wrapping div, read here through `document.querySelector`.
    Alternative patterns: read from a context provider, from a server-
    supplied prop, or from cookies via the client cookie API.

    On theme change, the picker's onChange handler writes the cookie so
    the next SSR request paints in the new theme from byte zero.
*/

import { useEffect, useState } from "react";
import { ThemePicker } from "../../ThemePicker";

function readInitialThemeFromDom(): string {
    if (typeof document === "undefined") return "";
    return (
        document.querySelector<HTMLDivElement>("[data-initial-theme]")
            ?.dataset.initialTheme ?? ""
    );
}

function writeThemeCookie(slug: string) {
    document.cookie =
        `theme=${slug}; path=/; max-age=31536000; SameSite=Lax`;
}

export default function ThemePickerPage() {
    const [theme, setTheme] = useState("");

    // Pull initial value out of the server-rendered DOM on mount so the
    // picker hydrates with the same value the server used.
    useEffect(() => {
        const initial = readInitialThemeFromDom();
        if (initial) setTheme(initial);
    }, []);

    return (
        <>
            <h1>Next.js cookie theme demo</h1>

            <ThemePicker
                label="Theme"
                themesUrl="/assets/themes/"
                themes={["light", "dark", "abyss"]}
                value={theme}
                onChange={(slug) => {
                    setTheme(slug);
                    writeThemeCookie(slug);
                }}
            />

            <p>
                The picker writes the active theme to a cookie. On the
                next request, the server reads the cookie and inlines{" "}
                <code>data-theme</code> on <code>&lt;html&gt;</code>{" "}
                plus the active theme&apos;s{" "}
                <code>&lt;link rel=&quot;stylesheet&quot;&gt;</code> before
                the page is sent — so the first paint already matches your
                choice.
            </p>
        </>
    );
}
