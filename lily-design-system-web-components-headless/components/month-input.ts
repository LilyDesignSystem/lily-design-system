// MonthInput component
//
// A native <input type="month">, storing the month in "YYYY-MM" format.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value ("YYYY-MM"); also a live `value` property.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (min, max, id, name, …).
//
// References:
//   - components/month-input/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled"]);

export class MonthInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "month";
        input.className = rootClassName(this, "month-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        input.value = this.getAttribute("value") ?? "";
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
