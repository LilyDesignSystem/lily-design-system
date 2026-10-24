// ConvertIntoDiv component
//
// A headless part of ConvertDiv: the target side of a conversion, holding the value and unit to convert into. Contract: a plain wrapper with the base class and children.
// Renders a <div class="convert-into-div"> in light DOM and moves the host's
// children into it. Carries no strings of its own.
//
// Attributes: none. Other attributes (id, data-*, aria-*) are passed
// through to the <div>.
//
// References:
//   - components/convert-into-div/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set([]);

export class ConvertIntoDiv extends HTMLElement {
    static observedAttributes = [];

    #el: HTMLElement | null = null;

    connectedCallback(): void {
        if (this.#el) return;
        const el = document.createElement("div");
        el.className = rootClassName(this, "convert-into-div");
        passThroughAttributes(this, el, HANDLED);
        moveChildrenInto(this, el);
        this.appendChild(el);
        this.#el = el;
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const el = this.#el;
        if (!el) return;
        void el;
    }
}
