"use client";

/*
    Example 7 — Multiple pickers in one page.

    Each select gets a distinct `name`. The `name` plays two roles:
      1. It is the <select> `name`, so the two controls submit separately.
      2. It is the discriminator on the managed <link> element, so each
         select swaps its own stylesheet without stepping on the other.

    This is useful for: a "global" theme + a per-section accent theme;
    preview-vs-live theme A/B; or a settings page that compares two
    themes side-by-side.

    Note: the active `data-theme` attribute on <html> is set by whichever
    picker fires last. If you want two independent regions, pass a
    per-picker `target` so each updates a different DOM subtree.
*/

import { useRef, useState, useEffect } from "react";
import { ThemeSelect } from "../ThemeSelect";

export function MultipleSelectsExample() {
    const regionARef = useRef<HTMLElement | null>(null);
    const regionBRef = useRef<HTMLElement | null>(null);

    // Force a re-render after refs resolve so we can pass them as
    // `target` props.
    const [, setReady] = useState(false);
    useEffect(() => setReady(true), []);

    return (
        <>
            <section ref={regionARef}>
                <ThemeSelect
                    label="Region A theme"
                    name="region-a"
                    themesUrl="/assets/themes/"
                    themes={["light", "dark"]}
                    target={regionARef.current}
                />
            </section>

            <section ref={regionBRef}>
                <ThemeSelect
                    label="Region B theme"
                    name="region-b"
                    themesUrl="/assets/themes/"
                    themes={["abyss", "cupcake", "dracula"]}
                    target={regionBRef.current}
                />
            </section>
        </>
    );
}

export default MultipleSelectsExample;
