"use client";

/*
    Example 5 — Custom button glyph via the `children` render prop.

    The control renders an icon button that opens a listbox. By default
    the button holds an "A" glyph (U+0041). The `children` render prop
    REPLACES that glyph — it does not render the options, which the
    component owns along with the keyboard contract.

    The render prop receives:
      - value:    the active slug
      - open:     is the listbox expanded?
      - labelFor: the resolved display label for a slug

    Below, the button shows the active size's label next to a small
    disclosure caret, so the closed control is more discoverable than
    the bare glyph alone.

    Note: everything is aria-hidden. The button's accessible name comes
    from the `label` prop via aria-label — never let the glyph or the
    label span become the name.
*/

import { TextSizePicker } from "../TextSizePicker";

export function CustomRenderingExample() {
    return (
        <TextSizePicker
            label="Text size"
            sizes={["small", "medium", "large", "x-large"]}
        >
            {({ value, open, labelFor }) => (
                <>
                    <span aria-hidden="true">A</span>
                    <span aria-hidden="true">{labelFor(value)}</span>
                    <span aria-hidden="true">{open ? "▴" : "▾"}</span>
                </>
            )}
        </TextSizePicker>
    );
}

export default CustomRenderingExample;
