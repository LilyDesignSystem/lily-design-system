// WeekInput component
//
// A native <input type="week">. Value format is ISO 8601 YYYY-Www, per
// the canonical contract. Same shape as TextInput/TelInput.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value (YYYY-Www); also a live `value` property.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (min, max, …).
//
// References:
//   - components/week-input/index.md (canonical contract)
//   - MDN input type="week": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/week

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled"]);

export class WeekInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "week";
        input.className = rootClassName(this, "week-input");
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
