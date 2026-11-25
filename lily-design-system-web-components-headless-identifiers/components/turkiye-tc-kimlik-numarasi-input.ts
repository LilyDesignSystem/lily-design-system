// TurkiyeTcKimlikNumarasiInput component
//
// A headless input for entering Turkey's T.C. Kimlik Numarası.
// Format: Eleven digits; digits 10-11 are computed check digits, the last always even.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value; also exposed as a live `value` property.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (except autocomplete, which this component
//     always forces to "off" to protect the sensitive identifier).
//
// References:
//   - components/turkiye-tc-kimlik-numarasi-input/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Turkish_Identification_Number

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { PrivateValue } from "../lib/private-value.js";

const HANDLED = new Set(["label", "value", "required", "disabled", "autocomplete"]);

export class TurkiyeTcKimlikNumarasiInput extends HTMLElement {
    #input: HTMLInputElement | null = null;
    readonly #value = new PrivateValue(this);

    static get observedAttributes(): string[] {
        return ["value"];
    }

    attributeChangedCallback(_name: string, _old: string | null, next: string | null): void {
        this.#value.attribute(next);
    }

    disconnectedCallback(): void {
        this.#value.disconnect();
    }

    connectedCallback(): void {
        if (this.#input) {
            this.#value.connect(this.#input);
            return;
        }

        const input = document.createElement("input");
        input.type = "text";
        input.className = rootClassName(this, "turkiye-tc-kimlik-numarasi-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        if (this.hasAttribute("required")) input.required = true;
        if (this.hasAttribute("disabled")) input.disabled = true;
        input.setAttribute("autocomplete", "off");
        input.setAttribute("spellcheck", "false");
        passThroughAttributes(this, input, HANDLED);

        this.appendChild(input);
        this.#input = input;
        this.#value.connect(input);
    }

    get value(): string {
        return this.#value.value;
    }

    set value(v: string) {
        this.#value.value = v;
    }
}
