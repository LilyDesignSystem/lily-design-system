"use client";

/*
    Example 2 — Controlled value + onChange callback.

    The React equivalent of Svelte's `bind:value` is a controlled
    `value` prop paired with an `onChange` setter. `onChange` also
    fires after each apply, which is the right hook for analytics,
    telling the server, or notifying a sibling component.
*/

import { useState } from "react";
import { ThemePicker } from "../ThemePicker";

function trackThemeChange(slug: string) {
    // e.g. fetch("/api/preferences", { method: "POST", body: JSON.stringify({ theme: slug }) });
    console.info("theme changed:", slug);
}

export function TwoWayBindingExample() {
    const [theme, setTheme] = useState("");

    return (
        <>
            <ThemePicker
                label="Theme"
                themesUrl="/assets/themes/"
                themes={["light", "dark", "abyss"]}
                value={theme}
                onChange={(slug) => {
                    setTheme(slug);
                    trackThemeChange(slug);
                }}
            />
            <p>
                Current theme: <strong>{theme || "(resolving…)"}</strong>
            </p>
        </>
    );
}

export default TwoWayBindingExample;
