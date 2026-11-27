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
import { part } from "../lib/live-element.js";

const HANDLED = new Set<string>(["label"]);

export class Kbd extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const root = this.querySelector(":scope > kbd.kbd");
        if (!root) return;
        root.className = rootClassName(this, "kbd");
        root.querySelector(":scope > .screen-reader-span")?.remove();
        const label = this.getAttribute("label");
        const text = root.querySelector(":scope > .kbd-text");
        if (label) text?.setAttribute("aria-hidden", "true");
        else text?.removeAttribute("aria-hidden");
        if (label) root.prepend(part("screen-reader-span", `${label} `));
    }

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
