/*
    Scoped target — change locale of one region, not the whole page.

    Useful for multilingual content panels: a single page with two cards
    each in a different language. Pass `target={panelEl}` so the select
    writes lang/dir to that element instead of <html>.

    Outcome: the surrounding page stays in its document language; each
    chosen panel switches independently.
*/

import { createSignal } from "solid-js";
import { LocalePicker } from "../LocalePicker";

export function ScopedTargetExample() {
    const [panelA, setPanelA] = createSignal<HTMLElement | null>(null);
    const [panelB, setPanelB] = createSignal<HTMLElement | null>(null);

    const [aLocale, setALocale] = createSignal("en");
    const [bLocale, setBLocale] = createSignal("fr");

    return (
        <article>
            <h1>Document language stays English; panels switch independently.</h1>

            <section
                ref={setPanelA}
                class="panel"
            >
                <h2>Panel A</h2>
                <LocalePicker
                    label="Panel A language"
                    name="panel-a-locale"
                    locales={["en", "fr", "ar"]}
                    target={panelA()}
                    value={aLocale()}
                    onChange={setALocale}
                />
                <p>
                    Current panel locale: <code>{aLocale()}</code>
                </p>
            </section>

            <section
                ref={setPanelB}
                class="panel"
            >
                <h2>Panel B</h2>
                <LocalePicker
                    label="Panel B language"
                    name="panel-b-locale"
                    locales={["en", "fr", "ar"]}
                    target={panelB()}
                    value={bLocale()}
                    onChange={setBLocale}
                />
                <p>
                    Current panel locale: <code>{bLocale()}</code>
                </p>
            </section>
        </article>
    );
}

export default ScopedTargetExample;

/*
    Notes on ref timing:
        - `target` is read every time `applyLocale` runs (mount + every
          value change). The refs are populated when the
          section mounts, so `target` is the element by the time the picker applies.
        - If you need to scope to an element that mounts later, pass a
          stable wrapper element (e.g. a div mounted at app root) and
          render the panel inside it.
        - Each select has its own `name` prop so the form controls don't
          collide.
*/
