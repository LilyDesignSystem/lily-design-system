// ToolCallName component
//
// A headless inner part of ToolCall: the name of the tool in a tool call, shown in the summary. Contract: a plain wrapper with the base class and children.
// Renders a <span class="tool-call-name"> in light DOM and moves the host's
// children into it. Carries no strings of its own.
//
// Attributes: none. Other attributes (id, data-*, aria-*) are passed
// through to the <span>.
//
// References:
//   - components/tool-call-name/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set([]);

export class ToolCallName extends HTMLElement {
    static observedAttributes = [];

    #el: HTMLElement | null = null;

    connectedCallback(): void {
        if (this.#el) return;
        const el = document.createElement("span");
        el.className = rootClassName(this, "tool-call-name");
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
