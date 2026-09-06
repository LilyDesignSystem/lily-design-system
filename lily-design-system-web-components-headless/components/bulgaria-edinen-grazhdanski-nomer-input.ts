// BulgariaEdinenGrazhdanskiNomerInput component
//
// A headless input for entering Bulgaria's Единен граждански номер /
// Edinen grazhdanski nomer (EGN).
// Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3
//   encode area and birth order (ninth digit even for boy, odd for girl),
//   and the tenth is a check digit.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value; also exposed as a live `value` property.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (except autocomplete, which this component
//     always forces to "off" to protect the sensitive identifier).
//
// References:
//   - components/bulgaria-edinen-grazhdanski-nomer-input/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Unique_citizenship_number

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled", "autocomplete"]);

export class BulgariaEdinenGrazhdanskiNomerInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "text";
        input.className = rootClassName(this, "bulgaria-edinen-grazhdanski-nomer-input");
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
