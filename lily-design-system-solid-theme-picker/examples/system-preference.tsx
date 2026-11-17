/*
    Example 8 — Follow the OS `prefers-color-scheme`.

    The select has no opinion about light vs. dark; it just owns the
    selection contract. To make the first-visit default follow the OS,
    resolve the media query yourself and pass the resolved slug as
    `defaultValue`. The user can still pick anything they like
    afterwards, and the choice persists via `storageKey`.

    If you want the select to *track* the OS preference over time (re-
    apply when the user toggles their system setting), add a
    `matchMedia.addEventListener("change", …)` listener and write to the
    controlled value.
*/

import { createSignal, onSettled } from "solid-js";
import { ThemePicker } from "../ThemePicker";

export function SystemPreferenceExample() {
    const [theme, setTheme] = createSignal("");

    // Track OS colour scheme changes live, from the first settled render on (never on the server).
    onSettled(() => {
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        if (!theme()) setTheme(mql.matches ? "dark" : "light");
        const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    });

    return (
        <ThemePicker
            label="Theme"
            themesUrl="/assets/themes/"
            themes={["light", "dark"]}
            value={theme() || undefined}
            onChange={setTheme}
            storageKey="my-app:theme"
        />
    );
}

export default SystemPreferenceExample;
