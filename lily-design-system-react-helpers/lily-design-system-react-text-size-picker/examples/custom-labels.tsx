"use client";

/*
    Example 4 — Custom labels.

    Default labels title-case the slug ("x-large" → "X Large"). Pass
    `sizeLabels` to override per-slug — useful for i18n or for a
    friendlier vocabulary than the raw slugs.
*/

import { TextSizePicker } from "../TextSizePicker";

const labels: Record<string, string> = {
    small: "Compact",
    medium: "Standard",
    large: "Comfortable",
    "x-large": "Huge",
};

export function CustomLabelsExample() {
    return (
        <TextSizePicker
            label="Taille du texte"
            sizes={["small", "medium", "large", "x-large"]}
            sizeLabels={labels}
        />
    );
}

export default CustomLabelsExample;
