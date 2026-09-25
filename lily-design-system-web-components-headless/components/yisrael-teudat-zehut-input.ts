// YisraelTeudatZehutInput component
//
// A headless input for entering Israel's Teudat Zehut (תעודת זהות).
// Format: Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10)
// check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over
// 9 has its own two digits summed, and the total must be a multiple of 10.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value; also exposed as a live `value` property.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (except autocomplete, which this component
//     always forces to "off" to protect the sensitive identifier).
//
// References:
//   - components/yisrael-teudat-zehut-input/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Israeli_identity_card

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled", "autocomplete"]);

export class YisraelTeudatZehutInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "text";
        input.className = rootClassName(this, "yisrael-teudat-zehut-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        input.value = this.getAttribute("value") ?? "";
        if (this.hasAttribute("required")) input.required = true;
        if (this.hasAttribute("disabled")) input.disabled = true;
        input.setAttribute("autocomplete", "off");
        passThroughAttributes(this, input, HANDLED);

        this.appendChild(input);
        this.#input = input;
    }

    get value(): string {
        return this.#input?.value ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#input) this.#input.value = v;
        else this.setAttribute("value", v);
    }
}
