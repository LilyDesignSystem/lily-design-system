"use client";

/*
    Example 5 — Custom button glyph via the `children` render prop.

    The control renders an icon button that opens a listbox. By default
    the button holds a half-circle glyph (U+25D1). The `children` render
    prop REPLACES that glyph — it no longer renders the options, which
    the component now owns along with the keyboard contract.

    The render prop receives:
      - value:    the active slug
      - open:     is the listbox expanded?
      - labelFor: the resolved display label for a slug

    Below, the button shows a live swatch of the active theme. The
    swatch carries `data-theme` so consumer CSS can colour it through
    the same `[data-theme]` cascade the themes themselves use.

    Note: everything is aria-hidden. The button's accessible name comes
    from the `label` prop via aria-label — never let the glyph or the
    swatch become the name.
*/

import { ThemeSelect } from "../ThemeSelect";

export function CustomRenderingExample() {
    return (
        <ThemeSelect
            label="Theme"
            themesUrl="/assets/themes/"
            themes={["light", "dark", "abyss", "cupcake", "dracula"]}
        >
            {({ value, open, labelFor }) => (
                <>
                    <span
                        className="theme-select-swatch"
                        data-theme={value}
                        aria-hidden="true"
                    />
                    <span aria-hidden="true">{labelFor(value)}</span>
                    <span aria-hidden="true">{open ? "▴" : "▾"}</span>
                </>
            )}
        </ThemeSelect>
    );
}

export default CustomRenderingExample;
