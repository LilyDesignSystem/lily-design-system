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

import { createSignal } from "solid-js";
import { TextSizePicker } from "../TextSizePicker";

export function MultiplePickersExample() {
    const [regionA, setRegionA] = createSignal<HTMLElement | null>(null);
    const [regionB, setRegionB] = createSignal<HTMLElement | null>(null);

    return (
        <>
            <section ref={setRegionA}>
                <TextSizePicker
                    label="Article text size"
                    name="article-text-size"
                    sizes={["small", "medium", "large"]}
                    target={regionA()}
                />
            </section>

            <section ref={setRegionB}>
                <TextSizePicker
                    label="Sidebar text size"
                    name="sidebar-text-size"
                    sizes={["small", "medium", "large", "x-large"]}
                    target={regionB()}
                />
            </section>
        </>
    );
}

export default MultiplePickersExample;
