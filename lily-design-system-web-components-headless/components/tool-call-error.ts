// ToolCallError component
//
// A headless inner part of ToolCall: the error shown when a tool call fails. Contract: `role="alert"` announces the error when it appears (open the tool call on error so it is not hidden inside a closed `<details>`).
// Renders a <div class="tool-call-error"> in light DOM and moves the host's
// children into it. Carries no strings of its own.
//
// Attributes: none. Other attributes (id, data-*, aria-*) are passed
// through to the <div>.
//
// References:
//   - components/tool-call-error/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set([]);

export class ToolCallError extends HTMLElement {
    static observedAttributes = [];

    #el: HTMLElement | null = null;

    connectedCallback(): void {
        if (this.#el) return;
        const el = document.createElement("div");
        el.className = rootClassName(this, "tool-call-error");
        el.setAttribute("role", "alert");
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
