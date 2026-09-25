// NihonKojinBangoInput component
//
// A headless input for entering Japan's Individual Number / My Number (マイナンバー).
// Format: Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check
// digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for
// positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder
// subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value; also exposed as a live `value` property.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (except autocomplete, which this component
//     always forces to "off" to protect the sensitive identifier).
//
// References:
//   - components/nihon-kojin-bango-input/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Individual_Number

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled", "autocomplete"]);

export class NihonKojinBangoInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "text";
        input.className = rootClassName(this, "nihon-kojin-bango-input");
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
