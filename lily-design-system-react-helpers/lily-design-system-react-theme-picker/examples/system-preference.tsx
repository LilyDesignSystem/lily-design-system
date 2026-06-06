"use client";

/*
    Example 8 — Follow the OS `prefers-color-scheme`.

    The picker has no opinion about light vs. dark; it just owns the
    selection contract. To make the first-visit default follow the OS,
    resolve the media query yourself and pass the resolved slug as
    `defaultValue`. The user can still pick anything they like
    afterwards, and the choice persists via `storageKey`.

    If you want the picker to *track* the OS preference over time (re-
    apply when the user toggles their system setting), add a
    `matchMedia.addEventListener("change", …)` listener and write to the
    controlled value.
*/

import { useEffect, useState } from "react";
import { ThemePicker } from "../ThemePicker";

export function SystemPreferenceExample() {
    const [theme, setTheme] = useState("");

    // Track OS colour scheme changes live.
    useEffect(() => {
        if (typeof window === "undefined") return;
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? "dark" : "light");
        };
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    // First-visit default — read once, used as defaultValue.
    const [prefersDark] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    });

    return (
        <ThemePicker
            label="Theme"
            themesUrl="/assets/themes/"
            themes={["light", "dark"]}
            defaultValue={prefersDark ? "dark" : "light"}
            value={theme}
            onChange={setTheme}
            storageKey="my-app:theme"
        />
    );
}

export default SystemPreferenceExample;
