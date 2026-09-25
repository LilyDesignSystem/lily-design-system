// SingaporeNationalRegistrationIdentityCardInput component
//
// A headless input for entering Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN).
// Format: One letter (S or T for citizens/permanent residents; F or G for long-term foreign
// residents; M for newer FIN series), seven digits, and a trailing check letter. The check letter
// is computed by multiplying the seven digits by fixed weights (2,7,6,5,4,3,2), summing the
// products (adding 4 for a G/T prefix or 3 for an M prefix), taking the sum Modulus 11, and mapping
// (10 - remainder) through a lookup table to a letter.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value; also exposed as a live `value` property.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (except autocomplete, which this component
//     always forces to "off" to protect the sensitive identifier).
//
// References:
//   - components/singapore-national-registration-identity-card-input/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_Registration_Identity_Card

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled", "autocomplete"]);

export class SingaporeNationalRegistrationIdentityCardInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "text";
        input.className = rootClassName(this, "singapore-national-registration-identity-card-input");
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
