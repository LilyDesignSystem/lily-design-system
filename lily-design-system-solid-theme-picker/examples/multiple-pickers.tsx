/*
    Example 7 — Multiple selects in one page.

    Each select gets a distinct `name`. The `name` plays two roles:
      1. It is the <select> `name`, so the two controls submit separately.
      2. It is the discriminator on the managed <link> element, so each
         select swaps its own stylesheet without stepping on the other.

    This is useful for: a "global" theme + a per-section accent theme;
    preview-vs-live theme A/B; or a settings page that compares two
    themes side-by-side.

    Note: the active `data-theme` attribute on <html> is set by whichever
    select fires last. If you want two independent regions, pass a
    per-select `target` so each updates a different DOM subtree.
*/

import { createSignal } from "solid-js";
import { ThemePicker } from "../ThemePicker";

export function MultiplePickersExample() {
    // Each region is a signal set by its ref, so each picker receives its target once the section exists.
    const [regionA, setRegionA] = createSignal<HTMLElement | null>(null);
    const [regionB, setRegionB] = createSignal<HTMLElement | null>(null);

    return (
        <>
            <section ref={setRegionA}>
                <ThemePicker
                    label="Region A theme"
                    name="region-a"
                    themesUrl="/assets/themes/"
                    themes={["light", "dark"]}
                    target={regionA()}
                />
            </section>

            <section ref={setRegionB}>
                <ThemePicker
                    label="Region B theme"
                    name="region-b"
                    themesUrl="/assets/themes/"
                    themes={["abyss", "cupcake", "dracula"]}
                    target={regionB()}
                />
            </section>
        </>
    );
}

export default MultiplePickersExample;
