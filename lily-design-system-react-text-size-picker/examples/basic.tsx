"use client";

/*
    Example 1 — Basic usage.

    The minimum viable picker: a label and a list of size slugs. The
    picker resolves "medium" as the initial active size (since "medium"
    is in the list), and sets data-text-size="medium" on <html>.

    The default markup is a <div class="text-size-picker"> holding an
    icon button (the "A" glyph, U+0041) that opens a
    <ul class="text-size-picker-list" role="listbox"> with one
    <li class="text-size-picker-option" role="option"> per slug.

    The status line is part of the basic pattern, not an add-on.
    ------------------------------------------------------------------
    The closed control shows only a glyph: it never reads "Large". That
    keeps the control one icon wide, but it means neither a sighted user
    nor a screen-reader user learns the active size without opening the
    listbox. The <p className="text-size-picker-status"> below is the
    compensating channel — see ../docs/accessibility.md.

    Two details worth copying verbatim:

    - It is VISIBLE, not sr-only. Sighted users benefit too: the active
      size is otherwise invisible while the listbox is closed, which
      matters for cognitive accessibility. If your design genuinely
      cannot spare the line, keep the element and hide it with the
      visually-hidden recipe rather than deleting it. (The other option
      is to pass a `children` render prop that shows the active label
      inside the button — see ./custom-rendering.tsx.)

    - aria-live="polite" announces MUTATIONS only, so this stays silent
      on first paint and speaks once on each subsequent change. That is
      the intended behaviour: no announcement on page load, one polite
      announcement per user action, and no focus movement.
*/

import { useState } from "react";
import { TextSizePicker, sizeName } from "../TextSizePicker";

/*
 * TextSizePicker keeps its own labelFor() internal and exposes it only
 * through the `children` render prop. The default rendering here does
 * not use that render prop, so use the exported `sizeName` — the same
 * title-casing rule the component applies internally — rather than
 * re-deriving it. Pass the same map to sizeLabels if you override
 * labels.
 */

export function BasicExample() {
    const [size, setSize] = useState("");

    return (
        <>
            <TextSizePicker
                label="Text size"
                sizes={["small", "medium", "large", "x-large"]}
                value={size}
                onChange={setSize}
            />

            <p className="text-size-picker-status" aria-live="polite">
                Text size: {sizeName(size)}
            </p>
        </>
    );
}

export default BasicExample;
