"use client";

/*
    Example 1 — Basic usage.

    The minimum viable select: a label, a themes directory, and a slug
    list. The select resolves "light" as the initial active theme (since
    "light" is in the list), sets data-theme="light" on <html>, and
    injects a <link rel="stylesheet"> pointing at /assets/themes/light.css.

    The default markup is a <div class="theme-chooser"> holding an icon
    button (the half-circle glyph, U+25D1) that opens a
    <ul class="theme-chooser-list" role="listbox"> with one
    <li class="theme-chooser-option" role="option"> per slug.

    The status line is part of the basic pattern, not an add-on.
    ------------------------------------------------------------------
    The closed control shows only a glyph: it never reads "Dark". That
    keeps the control one icon wide, but it means neither a sighted user
    nor a screen-reader user learns the active theme without opening the
    listbox. The <p className="theme-chooser-status"> below is the
    compensating channel, and it is the default pattern this package
    ships — see ../docs/accessibility.md.

    Two details worth copying verbatim:

    - It is VISIBLE, not sr-only. Sighted users benefit too: the active
      theme is otherwise invisible while the listbox is closed, which
      matters for cognitive accessibility. If your design genuinely
      cannot spare the line, keep the element and hide it with the
      visually-hidden recipe in ../docs/styling.md rather than deleting
      it. (The other option is to pass a `children` render prop that
      shows the active label inside the button — see
      ./custom-rendering.tsx.)

    - aria-live="polite" announces MUTATIONS only, so this stays silent
      on first paint and speaks once on each subsequent change. That is
      the intended behaviour: no announcement on page load, one polite
      announcement per user action, and no focus movement.
*/

import { useState } from "react";
import { ThemeChooser, themeName } from "../ThemeChooser";

/*
 * ThemeChooser keeps its own labelFor() internal and exposes it only
 * through the `children` render prop. The default rendering here does
 * not use that render prop, so use the exported `themeName` — the same
 * title-casing rule the component applies internally — rather than
 * re-deriving it. Pass the same map to themeLabels if you override
 * labels.
 */

export function BasicExample() {
    const [theme, setTheme] = useState("");

    return (
        <>
            <ThemeChooser
                label="Theme"
                themesUrl="/assets/themes/"
                themes={["light", "dark", "abyss"]}
                value={theme}
                onChange={setTheme}
            />

            <p className="theme-chooser-status" aria-live="polite">
                Active theme: {themeName(theme)}
            </p>
        </>
    );
}

export default BasicExample;
