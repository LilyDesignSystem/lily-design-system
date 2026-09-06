// ResetInput component
//
// A native <input type="reset"> that resets a form to its default values.
// Unlike TextInput, the accessible name comes from `value` (the button's
// own visible label text) rather than a separate `label`/aria-label prop
// — matching the canonical contract, which lists only `value` and
// `disabled` as props. A consumer who wants an aria-label override may
// still pass one through `...rest`.
//
// Attributes:
//   value — visible button text and accessible name, default "Reset";
//     also a live `value` property.
//   disabled — presence-based boolean.
//   ...rest — spread onto the <input>.
//
// Keyboard: Enter or Space activates (native <input type="reset">
// behaviour; the browser resets every sibling form field for free).
//
// References:
//   - components/reset-input/index.md (canonical contract)
//   - MDN input type="reset": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/reset

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["value", "disabled"]);

export class ResetInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "reset";
        input.className = rootClassName(this, "reset-input");
        input.value = this.getAttribute("value") ?? "Reset";
        if (this.hasAttribute("disabled")) input.disabled = true;
        passThroughAttributes(this, input, HANDLED);

        this.appendChild(input);
        this.#input = input;
    }

    get value(): string {
        return this.#input?.value ?? this.getAttribute("value") ?? "Reset";
    }

    set value(v: string) {
        if (this.#input) this.#input.value = v;
        else this.setAttribute("value", v);
    }
}
