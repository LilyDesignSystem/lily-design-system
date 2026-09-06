// CurrencyInput component
//
// A locale-aware currency input: native <input type="text"
// inputmode="decimal">. Formatting, symbols, and separators are left
// entirely to the consumer (typically via Intl.NumberFormat); this
// component only carries the numeric value and reflects the ISO 4217
// currency code as data-currency-code so consumer CSS/JS can read it
// back off the DOM.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — numeric string; also exposed as a live numeric `value`
//     property (undefined when empty) that proxies to the inner <input>.
//   currency-code — ISO 4217 code, default "USD"; reflected as
//     data-currency-code.
//   min, max — optional numeric constraints.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (id, name, placeholder, …).
//
// References:
//   - components/currency-input/index.md (canonical contract)
//   - Intl.NumberFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
//   - ISO 4217 Currency Codes: https://www.iso.org/iso-4217-currency-codes.html

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "currency-code", "min", "max", "required", "disabled"]);

export class CurrencyInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "text";
        input.inputMode = "decimal";
        input.className = rootClassName(this, "currency-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        const value = this.getAttribute("value");
        if (value !== null) input.value = value;
        input.setAttribute("data-currency-code", this.getAttribute("currency-code") ?? "USD");
        const min = this.getAttribute("min");
        if (min !== null) input.min = min;
        const max = this.getAttribute("max");
        if (max !== null) input.max = max;
        if (this.hasAttribute("required")) input.required = true;
        if (this.hasAttribute("disabled")) input.disabled = true;
        passThroughAttributes(this, input, HANDLED);

        this.appendChild(input);
        this.#input = input;
    }

    get value(): number | undefined {
        const v = this.#input?.value ?? this.getAttribute("value");
        return v === null || v === undefined || v === "" ? undefined : Number(v);
    }

    set value(v: number | undefined) {
        const str = v === undefined ? "" : String(v);
        if (this.#input) this.#input.value = str;
        else this.setAttribute("value", str);
    }
}
