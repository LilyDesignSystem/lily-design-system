"use client";

/*
    Example 1 — Basic usage.

    The minimum viable select: a label, a themes directory, and a slug
    list. The select resolves "light" as the initial active theme (since
    "light" is in the list), sets data-theme="light" on <html>, and
    injects a <link rel="stylesheet"> pointing at /assets/themes/light.css.

    Uncontrolled mode — the select manages its own state internally.
*/

import { ThemeSelect } from "../ThemeSelect";

export function BasicExample() {
    return (
        <ThemeSelect
            label="Theme"
            themesUrl="/assets/themes/"
            themes={["light", "dark", "abyss"]}
        />
    );
}

export default BasicExample;
