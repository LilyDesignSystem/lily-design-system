// UnitedStatesSocialSecurityNumberInput component
//
// A headless input for entering a US Social Security number.
// Format: 9 digits grouped as XXX-XX-XXXX.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value; also exposed as a live `value` property.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (except autocomplete, pattern, and
//     inputmode, which this component always sets itself per its canonical
//     contract: autocomplete="off" to protect the sensitive identifier,
//     pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" and inputmode="numeric" for the
//     documented XXX-XX-XXXX format).
//
// References:
//   - components/united-states-social-security-number-input/index.md (canonical contract)
//   - https://www.ssa.gov/employer/randomization.html

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled", "autocomplete", "pattern", "inputmode"]);

export class UnitedStatesSocialSecurityNumberInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "text";
        input.className = rootClassName(this, "united-states-social-security-number-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        input.value = this.getAttribute("value") ?? "";
        if (this.hasAttribute("required")) input.required = true;
        if (this.hasAttribute("disabled")) input.disabled = true;
        input.setAttribute("autocomplete", "off");
        input.setAttribute("pattern", "[0-9]{3}-[0-9]{2}-[0-9]{4}");
        input.setAttribute("inputmode", "numeric");
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
