// TextAreaInput component
//
// A native <textarea> for multi-line text entry.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial text; also a live `value` property.
//   rows — number of visible text rows (browser default if unset).
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <textarea>.
//
// Keyboard: standard native textarea editing; Enter inserts a new line
// rather than submitting a containing form.
//
// References:
//   - components/text-area-input/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "rows", "required", "disabled"]);

export class TextAreaInput extends HTMLElement {
    #textarea: HTMLTextAreaElement | null = null;

    connectedCallback(): void {
        if (this.#textarea) return;

        const textarea = document.createElement("textarea");
        textarea.className = rootClassName(this, "text-area-input");
        const label = this.getAttribute("label");
        if (label !== null) textarea.setAttribute("aria-label", label);
        textarea.value = this.getAttribute("value") ?? "";
        const rows = this.getAttribute("rows");
        if (rows !== null) textarea.rows = Number(rows);
        if (this.hasAttribute("required")) textarea.required = true;
        if (this.hasAttribute("disabled")) textarea.disabled = true;
        passThroughAttributes(this, textarea, HANDLED);

        this.appendChild(textarea);
        this.#textarea = textarea;
    }

    get value(): string {
        return this.#textarea?.value ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#textarea) this.#textarea.value = v;
        else this.setAttribute("value", v);
    }
}
