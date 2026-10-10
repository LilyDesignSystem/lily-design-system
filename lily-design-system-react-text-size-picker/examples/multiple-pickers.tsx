"use client";

/*
    Example 6 — Multiple pickers in one page.

    Each picker gets a distinct `name`, so the two controls submit
    separately in a form. Pass a per-picker `target` so each updates a
    different DOM subtree instead of both racing to set
    data-text-size on the same element.

    This is useful for: a "global" reading size + a per-widget preview
    size; a settings page that compares two sizes side-by-side; or an
    editor pane that scales independently of the surrounding chrome.
*/

import { useRef, useState, useEffect } from "react";
import { TextSizePicker } from "../TextSizePicker";

export function MultiplePickersExample() {
    const regionARef = useRef<HTMLElement | null>(null);
    const regionBRef = useRef<HTMLElement | null>(null);

    // Force a re-render after refs resolve so we can pass them as
    // `target` props.
    const [, setReady] = useState(false);
    useEffect(() => setReady(true), []);

    return (
        <>
            <section ref={regionARef}>
                <TextSizePicker
                    label="Article text size"
                    name="article-text-size"
                    sizes={["small", "medium", "large"]}
                    target={regionARef.current}
                />
            </section>

            <section ref={regionBRef}>
                <TextSizePicker
                    label="Sidebar text size"
                    name="sidebar-text-size"
                    sizes={["small", "medium", "large", "x-large"]}
                    target={regionBRef.current}
                />
            </section>
        </>
    );
}

export default MultiplePickersExample;
