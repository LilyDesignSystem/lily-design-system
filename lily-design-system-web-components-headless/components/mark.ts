// Mark component
//
// A headless inline wrapper: an inline highlight marking text as relevant or referenced, such as a search match, using the native mark element. Contract: a plain wrapper with the base class and children.
// Renders a <mark class="mark"> in light DOM and moves the host's
// children into it. Carries no strings of its own.
//
// Attributes: none. Other attributes (id, data-*, aria-*) are passed
// through to the <mark>.
//
// References:
//   - components/mark/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set([]);

export class Mark extends HTMLElement {
    static observedAttributes = [];

    #el: HTMLElement | null = null;

    connectedCallback(): void {
        if (this.#el) return;
        const el = document.createElement("mark");
        el.className = rootClassName(this, "mark");
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
