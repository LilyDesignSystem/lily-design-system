"use client";

/*
    Example 2 — Controlled value + onChange callback.

    The React equivalent of Svelte's `bind:value` is a controlled
    `value` prop paired with an `onChange` setter. `onChange` also
    fires after each apply, which is the right hook for analytics,
    telling the server, or notifying a sibling component.
*/

import { useState } from "react";
import { TextSizePicker } from "../TextSizePicker";

function trackTextSizeChange(slug: string) {
    // e.g. fetch("/api/preferences", { method: "POST", body: JSON.stringify({ textSize: slug }) });
    console.info("text size changed:", slug);
}

export function TwoWayBindingExample() {
    const [size, setSize] = useState("");

    return (
        <>
            <TextSizePicker
                label="Text size"
                sizes={["small", "medium", "large", "x-large"]}
                value={size}
                onChange={(slug) => {
                    setSize(slug);
                    trackTextSizeChange(slug);
                }}
            />
            <p>
                Current size: <strong>{size || "(resolving…)"}</strong>
            </p>
        </>
    );
}

export default TwoWayBindingExample;
