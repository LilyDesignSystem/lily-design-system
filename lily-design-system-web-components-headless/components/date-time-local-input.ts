// DateTimeLocalInput component
//
// A native <input type="datetime-local"> for entering a date and time
// without a time zone. No visible <label> is rendered — the consumer
// supplies the accessible name via `label` (aria-label). The browser
// provides the native datetime-picker UI.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — bindable datetime string (YYYY-MM-DDThh:mm); also exposed as
//     a live `value` property that proxies to the inner <input>.
//   min, max — optional datetime bounds.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input>.
//
// References:
//   - components/date-time-local-input/index.md (canonical contract)
//   - MDN datetime-local input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local

import { passThroughAttributes, rootClassName, followInput } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "min", "max", "required", "disabled"]);

export class DateTimeLocalInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    // A change to label, value (the default), min, max, required, disabled or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        if (this.#input) followInput(this, this.#input, "date-time-local-input", { range: true });
    }

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "datetime-local";
        input.className = rootClassName(this, "date-time-local-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        input.defaultValue = this.getAttribute("value") ?? "";
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

    get value(): string {
        return this.#input?.value ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#input) this.#input.value = v;
        else this.setAttribute("value", v);
    }
}
