// SubmitInput component
//
// A native <input type="submit"> that submits its containing form. Same
// shape as ResetInput: the accessible name comes from `value` (the
// button's own visible label text), not a separate `label` prop.
//
// Attributes:
//   value — visible button text and accessible name, default "Submit";
//     also a live `value` property.
//   disabled — presence-based boolean.
//   ...rest — spread onto the <input>.
//
// Keyboard: Enter or Space activates (native <input type="submit">
// behaviour; also triggers the browser's built-in form validation).
//
// References:
//   - components/submit-input/index.md (canonical contract)
//   - MDN input type="submit": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/submit

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["value", "disabled"]);

export class SubmitInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "submit";
        input.className = rootClassName(this, "submit-input");
        input.value = this.getAttribute("value") ?? "Submit";
        if (this.hasAttribute("disabled")) input.disabled = true;
        passThroughAttributes(this, input, HANDLED);

        this.appendChild(input);
        this.#input = input;
    }

    get value(): string {
        return this.#input?.value ?? this.getAttribute("value") ?? "Submit";
    }

    set value(v: string) {
        if (this.#input) this.#input.value = v;
        else this.setAttribute("value", v);
    }
}
