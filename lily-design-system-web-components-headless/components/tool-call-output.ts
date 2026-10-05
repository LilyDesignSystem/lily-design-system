// ToolCallOutput component
//
// A headless inner part of ToolCall: the output or result returned by a tool in a tool call. Contract: `label` (optional) sets `role="group"` and `aria-label`; without it neither is rendered.
// Renders a <div class="tool-call-output"> in light DOM and moves the host's
// children into it. Carries no strings of its own.
//
// Attributes: `label`. Other attributes (id, data-*, aria-*) are passed
// through to the <div>.
//
// References:
//   - components/tool-call-output/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class ToolCallOutput extends HTMLElement {
    static observedAttributes = ["label"];

    #el: HTMLElement | null = null;

    connectedCallback(): void {
        if (this.#el) return;
        const el = document.createElement("div");
        el.className = rootClassName(this, "tool-call-output");
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
        if (label) { el.setAttribute("role", "group"); el.setAttribute("aria-label", label); }
        else { el.removeAttribute("role"); el.removeAttribute("aria-label"); }
    }
}
