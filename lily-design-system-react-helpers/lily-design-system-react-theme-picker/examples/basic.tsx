"use client";

/*
    Example 1 — Basic usage.

    The minimum viable picker: a label, a themes directory, and a slug
    list. The picker resolves "light" as the initial active theme (since
    "light" is in the list), sets data-theme="light" on <html>, and
    injects a <link rel="stylesheet"> pointing at /assets/themes/light.css.

    Uncontrolled mode — the picker manages its own state internally.
*/

import { ThemePicker } from "../ThemePicker";

export function BasicExample() {
    return (
        <ThemePicker
            label="Theme"
            themesUrl="/assets/themes/"
            themes={["light", "dark", "abyss"]}
        />
    );
}

export default BasicExample;
