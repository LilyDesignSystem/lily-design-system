// Input component
//
// A generic native <input> whose `type` is configurable — unlike this
// catalog's more specific *Input components (TextInput, EmailInput, …),
// which each hardcode their own `type`.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   type — default "text"; any valid HTML input type.
//   value — initial value; also a live `value` property.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (placeholder, maxlength, pattern, …).
//
// References:
//   - components/input/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "type", "value", "required", "disabled"]);

export class Input extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = this.getAttribute("type") ?? "text";
        input.className = rootClassName(this, "input");
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
