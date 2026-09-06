// TimeInput component
//
// A native <input type="time">. Same shape as TextInput/TelInput; value
// format is HH:MM (24-hour), per the canonical contract.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value (HH:MM); also a live `value` property.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (min, max, step, …).
//
// References:
//   - components/time-input/index.md (canonical contract)
//   - MDN input type="time": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled"]);

export class TimeInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "time";
        input.className = rootClassName(this, "time-input");
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
