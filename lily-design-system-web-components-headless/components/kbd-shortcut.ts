// KbdShortcut component
//
// A keyboard shortcut: an outer <kbd class="kbd-shortcut"> holding one
// <kbd class="kbd-shortcut-key"> per key, with aria-hidden
// <span class="kbd-shortcut-separator"> between them.
//
// Attributes:
//   keys — REQUIRED. A JSON array (`keys='["Ctrl","K"]'`) or, failing
//     that, a comma-separated list. Deviation from Svelte's string[] prop:
//     attributes are text; the `keys` property accepts a real string[]
//     and re-renders.
//   separator — decorative separator, default "+".
//   label — optional spoken form, via aria-label on the root.
//   ...rest — spread onto the outer <kbd>.
//
// References:
//   - components/kbd-shortcut/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { parseValues } from "../lib/list-values.js";

const HANDLED = new Set(["keys", "separator", "label"]);

export class KbdShortcut extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["keys", "separator", "label"];
    }

    #kbd: HTMLElement | null = null;
    #keys: string[] | null = null;

    connectedCallback(): void {
        if (this.#kbd) return;
        const kbd = document.createElement("kbd");
        kbd.className = rootClassName(this, "kbd-shortcut");
        passThroughAttributes(this, kbd, HANDLED);
        this.#kbd = kbd;
        this.replaceChildren(kbd);
        this.#render();
    }

    attributeChangedCallback(): void {
        this.#render();
    }

    get keys(): string[] {
        return this.#keys ?? parseValues(this.getAttribute("keys"));
    }

    set keys(v: string[]) {
        this.#keys = v;
        this.#render();
    }

    #render(): void {
        const kbd = this.#kbd;
        if (!kbd) return;
        const label = this.getAttribute("label");
        if (label !== null) kbd.setAttribute("aria-label", label);
        else kbd.removeAttribute("aria-label");

        const separator = this.getAttribute("separator") ?? "+";
        kbd.replaceChildren();
        this.keys.forEach((key, i) => {
            if (i > 0) {
                const sep = document.createElement("span");
                sep.className = "kbd-shortcut-separator";
                sep.setAttribute("aria-hidden", "true");
                sep.textContent = separator;
                kbd.appendChild(sep);
            }
            const k = document.createElement("kbd");
            k.className = "kbd-shortcut-key";
            k.textContent = key;
            kbd.appendChild(k);
        });
    }
}
