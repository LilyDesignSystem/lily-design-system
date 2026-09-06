// AddressInput component
//
// A native <input type="text" autocomplete="street-address"> for
// searching or manually entering an address. Any postcode lookup,
// autocomplete dropdown, or fallback to a multi-field structured form is
// the consumer's responsibility.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value; also exposed as a live `value` property that
//     proxies to the inner <input>.
//   autocomplete — default "street-address"; other useful values include
//     "address-line1", "address-line2", "postal-code".
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input>.
//
// References:
//   - components/address-input/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled", "autocomplete"]);

export class AddressInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "text";
        input.className = rootClassName(this, "address-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        input.value = this.getAttribute("value") ?? "";
        input.setAttribute("autocomplete", this.getAttribute("autocomplete") ?? "street-address");
        if (this.hasAttribute("required")) input.required = true;
        if (this.hasAttribute("disabled")) input.disabled = true;
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
