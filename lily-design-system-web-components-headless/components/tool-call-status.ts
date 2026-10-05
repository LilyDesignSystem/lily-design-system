// ToolCallStatus component
//
// A headless inner part of ToolCall: the status of a tool call as a word, such as pending, running, done or error. Contract: `status` (optional) sets `data-status`; the visible status word is the children (consumer text, never colour alone).
// Renders a <span class="tool-call-status"> in light DOM and moves the host's
// children into it. Carries no strings of its own.
//
// Attributes: `status`. Other attributes (id, data-*, aria-*) are passed
// through to the <span>.
//
// References:
//   - components/tool-call-status/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["status"]);

export class ToolCallStatus extends HTMLElement {
    static observedAttributes = ["status"];

    #el: HTMLElement | null = null;

    connectedCallback(): void {
        if (this.#el) return;
        const el = document.createElement("span");
        el.className = rootClassName(this, "tool-call-status");
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
        const status = this.getAttribute("status");
        if (status) el.setAttribute("data-status", status);
        else el.removeAttribute("data-status");
    }
}
