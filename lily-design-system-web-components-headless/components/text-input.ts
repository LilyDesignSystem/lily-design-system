// TextInput component
//
// A native <input type="text">. No visible <label> is rendered — the
// consumer supplies the accessible name via `label` (aria-label) and may
// wrap the element in their own <label> if they want visible text too.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value; also exposed as a live `value` property that
//     proxies to the inner <input> (so `el.value` reads/writes it directly,
//     same shape as a real form control).
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (placeholder, maxlength, pattern, …).
//
// Keyboard: none beyond native <input> text-editing behaviour.
//
// References:
//   - components/text-input/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled"]);

export class TextInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "text";
        input.className = rootClassName(this, "text-input");
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
