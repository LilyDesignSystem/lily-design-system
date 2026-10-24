// ConvertDiv component
//
// A headless part of ConvertDiv: a group that converts a value from one unit into another, such as dollars into euros or miles into kilometres. Contract: a plain wrapper with the base class and children; role="group" named by `label`.
// Renders a <div class="convert-div"> in light DOM and moves the host's
// children into it. Carries no strings of its own.
//
// Attributes: `label` (required) becomes aria-label on the group. Other attributes
// (id, data-*, aria-*) are passed through to the <div>.
//
// References:
//   - components/convert-div/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class ConvertDiv extends HTMLElement {
    static observedAttributes = ["label"];

    #el: HTMLElement | null = null;

    connectedCallback(): void {
        if (this.#el) return;
        const el = document.createElement("div");
        el.className = rootClassName(this, "convert-div");
        el.setAttribute("role", "group");
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
        const label = this.getAttribute("label");
        if (label === null) el.removeAttribute("aria-label");
        else el.setAttribute("aria-label", label);
    }
}
