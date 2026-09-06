// UrlInput component
//
// A native <input type="url"> for entering a URL, with browser-native
// format validation. Same shape as TextInput/TelInput.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value; also a live `value` property.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (placeholder, pattern, …).
//
// References:
//   - components/url-input/index.md (canonical contract)
//   - MDN input type="url": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/url

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled"]);

export class UrlInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "url";
        input.className = rootClassName(this, "url-input");
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
