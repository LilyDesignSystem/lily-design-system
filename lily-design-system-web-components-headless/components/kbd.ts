// Kbd component
//
// A native <kbd> for displaying keyboard shortcuts and key combinations.
//
// Attributes: none beyond the base class + rest-props.
//
// References:
//   - components/kbd/index.md (canonical contract)
//   - MDN kbd element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set<string>(["label"]);

export class Kbd extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > kbd.kbd")) return;

        const kbd = document.createElement("kbd");
        kbd.className = rootClassName(this, "kbd");
        passThroughAttributes(this, kbd, HANDLED);

        const text = document.createElement("span");
        text.className = "kbd-text";
        moveChildrenInto(this, text);
        kbd.appendChild(text);
        const label = this.getAttribute("label");
        if (label) {
            text.setAttribute("aria-hidden", "true");
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${label} `;
            kbd.prepend(hidden);
        }
        this.appendChild(kbd);
    }
}
