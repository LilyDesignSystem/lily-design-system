// HiddenInput component
//
// A native <input type="hidden"> for including data in form submission.
// Hidden inputs are not perceivable by any user, so no ARIA attributes
// are applied.
//
// Attributes:
//   name — REQUIRED. The form field name.
//   value — default ""; also exposed as a live `value` property that
//     proxies to the inner <input>.
//   ...rest — spread onto the <input> (id, data-*, …).
//
// References:
//   - components/hidden-input/index.md (canonical contract)
//   - HTML hidden input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/hidden

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["name", "value"]);

export class HiddenInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "hidden";
        input.className = rootClassName(this, "hidden-input");
        const name = this.getAttribute("name");
        if (name !== null) input.name = name;
        input.value = this.getAttribute("value") ?? "";
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
