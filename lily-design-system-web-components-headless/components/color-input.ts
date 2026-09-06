// ColorInput component
//
// A native <input type="color"> for browser-native colour picking.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — default "#000000"; also exposed as a live `value` property
//     that proxies to the inner <input>.
//   disabled — presence-based boolean.
//   ...rest — spread onto the <input> (name, id, …).
//
// References:
//   - components/color-input/index.md (canonical contract)
//   - MDN input type="color": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "disabled"]);

export class ColorInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "color";
        input.className = rootClassName(this, "color-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        input.value = this.getAttribute("value") ?? "#000000";
        if (this.hasAttribute("disabled")) input.disabled = true;
        passThroughAttributes(this, input, HANDLED);

        this.appendChild(input);
        this.#input = input;
    }

    get value(): string {
        return this.#input?.value ?? this.getAttribute("value") ?? "#000000";
    }

    set value(v: string) {
        if (this.#input) this.#input.value = v;
        else this.setAttribute("value", v);
    }
}
