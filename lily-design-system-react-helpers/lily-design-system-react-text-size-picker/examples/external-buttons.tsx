"use client";

/*
    Example 7 — Driving the picker from your own UI.

    Sometimes you want bigger, more discoverable affordances than a
    dropdown — an A- / A+ preset row in a settings page, say. Because
    TextSizePicker supports a controlled `value`, your own buttons can
    drive it directly: set `value` to a new slug and the component
    applies it exactly the way choosing a listbox option would —
    data-text-size is set, storageKey is written, onChange fires.

    `sizeName` is exported for exactly this reason: your own UI can
    render labels that match the listbox without duplicating the
    title-casing rule.

    Note the aria-pressed on each preset button — these are toggles, and
    the state must be readable by assistive technology, not just visible
    as a highlight (WCAG 1.4.1: no colour-only meaning).
*/

import { useState } from "react";
import { TextSizePicker, sizeName } from "../TextSizePicker";

const SIZES = ["small", "medium", "large", "x-large"];

export function ExternalButtonsExample() {
    const [size, setSize] = useState("");

    return (
        <>
            <TextSizePicker
                label="Text size"
                sizes={SIZES}
                value={size}
                onChange={setSize}
                storageKey="lily-text-size"
            />

            <div role="group" aria-label="Text size presets">
                {SIZES.map((slug) => (
                    <button
                        key={slug}
                        type="button"
                        aria-pressed={slug === size}
                        onClick={() => setSize(slug)}
                    >
                        {sizeName(slug)}
                    </button>
                ))}
            </div>

            <p className="text-size-picker-status" aria-live="polite">
                Text size: {size ? sizeName(size) : "none"}
            </p>
        </>
    );
}

export default ExternalButtonsExample;
