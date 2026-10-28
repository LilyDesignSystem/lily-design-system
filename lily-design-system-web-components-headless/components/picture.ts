// Picture component
//
// A headless wrapper around the native picture element: the browser chooses among the source
// children (by media query, image type or resolution) and falls back to the img child.
// Renders a <picture class="picture"> in light DOM and moves the host's
// children (the source and img elements) into it. Carries no strings of
// its own; the img's alt is the consumer's.
//
// Attributes: none. Other attributes (id, data-*, aria-*) are passed
// through to the <picture>.
//
// References:
//   - components/picture/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set([]);

export class Picture extends HTMLElement {
    static observedAttributes = [];

    #el: HTMLElement | null = null;

    connectedCallback(): void {
        if (this.#el) return;
        const el = document.createElement("picture");
        el.className = rootClassName(this, "picture");
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
