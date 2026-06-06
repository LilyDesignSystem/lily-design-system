"use client";

/*
    09. Scoped target — change locale of one region, not the whole page.

    Useful for multilingual content panels: a single page with two cards
    each in a different language. Pass `target={panelEl}` so the picker
    writes lang/dir to that element instead of <html>.

    Outcome: the surrounding page stays in its document language; each
    chosen panel switches independently.
*/

import { useRef, useState } from "react";
import { LocalePicker } from "../LocalePicker";

export function ScopedTargetExample() {
    const panelARef = useRef<HTMLElement | null>(null);
    const panelBRef = useRef<HTMLElement | null>(null);

    const [aLocale, setALocale] = useState("en");
    const [bLocale, setBLocale] = useState("fr");

    return (
        <article>
            <h1>
                Document language stays English; panels switch
                independently.
            </h1>

            <section
                ref={panelARef}
                className="panel"
            >
                <h2>Panel A</h2>
                <LocalePicker
                    label="Panel A language"
                    name="panel-a-locale"
                    locales={["en", "fr", "ar"]}
                    target={panelARef.current}
                    value={aLocale}
                    onChange={setALocale}
                />
                <p>
                    Current panel locale: <code>{aLocale}</code>
                </p>
            </section>

            <section
                ref={panelBRef}
                className="panel"
            >
                <h2>Panel B</h2>
                <LocalePicker
                    label="Panel B language"
                    name="panel-b-locale"
                    locales={["en", "fr", "ar"]}
                    target={panelBRef.current}
                    value={bLocale}
                    onChange={setBLocale}
                />
                <p>
                    Current panel locale: <code>{bLocale}</code>
                </p>
            </section>
        </article>
    );
}

export default ScopedTargetExample;

/*
    Notes on ref timing:
        - `target` is read every time `applyLocale` runs (mount + every
          value change). The refs are populated by the time React runs
          our effects, so `target.current` is the section element.
        - If you need to scope to an element that mounts later, pass a
          stable wrapper element (e.g. a div mounted at app root) and
          render the panel inside it.
        - Each picker has its own `name` prop so the radio groups don't
          collide.
*/
