// NumberInput component
//
// A native <input type="number">. `min`, `max`, and `step` are not
// special-cased: HTMLInputElement reflects them as plain string content
// attributes, so they pass straight through to the <input> via the rest
// mechanism like any other attribute (id, name, placeholder, …).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial numeric value; also a live `value` property.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (min, max, step, id, name, …).
//
// References:
//   - components/number-input/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled"]);

export class NumberInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "number";
        input.className = rootClassName(this, "number-input");
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
