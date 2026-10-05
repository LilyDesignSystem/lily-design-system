// OneTimePasswordInput component
//
// A headless one-time-password (OTP / verification code) field. It is ONE
// real native <input>, not a row of segmented boxes (see PinInputDiv), so
// SMS / password-manager autofill (autocomplete="one-time-code") and paste
// work. The consumer owns verification; nothing is validated or submitted.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   length — REQUIRED number of characters (maxlength, data-length). No default.
//   value — initial value; also a live `value` property proxying the <input>.
//   inputmode — virtual keyboard hint, default "numeric" (use "text" for
//     alphanumeric codes).
//   pattern — allowed characters, default "[0-9]*".
//   name, required, disabled — as native.
//   ...rest — spread onto the <input>.
//
// Keyboard: none beyond native <input> text editing.
//
// References:
//   - components/one-time-password-input/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "length", "value", "inputmode", "pattern", "name", "required", "disabled"]);

export class OneTimePasswordInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.className = rootClassName(this, "one-time-password-input");
        input.type = "text";
        input.setAttribute("inputmode", this.getAttribute("inputmode") ?? "numeric");
        input.setAttribute("autocomplete", "one-time-code");
        const length = this.getAttribute("length");
        if (length !== null) {
            input.setAttribute("maxlength", length);
            input.setAttribute("data-length", length);
        }
        input.setAttribute("pattern", this.getAttribute("pattern") ?? "[0-9]*");
        input.spellcheck = false;
        input.setAttribute("autocapitalize", "off");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        const name = this.getAttribute("name");
        if (name !== null) input.name = name;
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
