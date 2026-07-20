"use client";

/*
    Example 1 — Basic usage.

    The minimum viable select: a label, a themes directory, and a slug
    list. The select resolves "light" as the initial active theme (since
    "light" is in the list), sets data-theme="light" on <html>, and
    injects a <link rel="stylesheet"> pointing at /assets/themes/light.css.

    The default markup is a native <select class="theme-select"> with one
    <option class="theme-select-option"> per slug.

    The status line is part of the basic pattern, not an add-on.
    ------------------------------------------------------------------
    The closed <select> is placeholder-pinned: it always reads "Theme",
    never "Dark". That keeps the control one word wide, but it means a
    screen-reader user never hears the active theme announced as the
    combobox value. The <p className="theme-select-status"> below is the
    compensating channel, and it is the default pattern this package
    ships — see ../docs/accessibility.md.

    Two details worth copying verbatim:

    - It is VISIBLE, not sr-only. Sighted users benefit too: the active
      theme is otherwise invisible once the control snaps back to the
      placeholder, which matters for cognitive accessibility. If your
      design genuinely cannot spare the line, keep the element and hide
      it with the visually-hidden recipe in ../docs/styling.md rather
      than deleting it.

    - aria-live="polite" announces MUTATIONS only, so this stays silent
      on first paint and speaks once on each subsequent change. That is
      the intended behaviour: no announcement on page load, one polite
      announcement per user action, and no focus movement.
*/

import { useState } from "react";
import { ThemeSelect } from "../ThemeSelect";

/*
 * ThemeSelect keeps its own labelFor() internal and exposes it only
 * through the `children` render prop. The default rendering here does
 * not use that render prop, so mirror the component's default label
 * rule: title-case the slug. Pass the same map to themeLabels if you
 * override labels.
 */
function labelFor(slug: string): string {
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function BasicExample() {
    const [theme, setTheme] = useState("");

    return (
        <>
            <ThemeSelect
                label="Theme"
                themesUrl="/assets/themes/"
                themes={["light", "dark", "abyss"]}
                value={theme}
                onChange={setTheme}
            />

            <p className="theme-select-status" aria-live="polite">
                Active theme: {labelFor(theme)}
            </p>
        </>
    );
}

export default BasicExample;
