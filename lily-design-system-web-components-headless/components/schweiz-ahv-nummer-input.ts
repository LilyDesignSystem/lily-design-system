// SchweizAhvNummerInput component
//
// A headless input for entering Switzerland's AHV-Nummer / Numéro AVS.
// Format: Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix
// 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over
// the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit
// AHV card number on 1 July 2008.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value; also exposed as a live `value` property.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (except autocomplete, which this component
//     always forces to "off" to protect the sensitive identifier).
//
// References:
//   - components/schweiz-ahv-nummer-input/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Data_codes_for_Switzerland

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled", "autocomplete"]);

export class SchweizAhvNummerInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "text";
        input.className = rootClassName(this, "schweiz-ahv-nummer-input");
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
