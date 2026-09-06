// TimePickerInput component
//
// A native <input type="time">, for built-in browser time selection
// behaviour (12-hour/24-hour format per browser locale).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value (HH:MM); also exposed as a live `value` property.
//   required, disabled — presence-based booleans.
//
// References:
//   - components/time-picker-input/index.md (canonical contract)
//   - MDN input type="time": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled"]);

export class TimePickerInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "time";
        input.className = rootClassName(this, "time-picker-input");
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
