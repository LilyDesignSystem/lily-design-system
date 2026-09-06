// Tag component
//
// A keyword label for categorizing content. Wraps a real
// <span role="status">.
//
// Attributes:
//   label — REQUIRED. Accessible label for screen readers, via aria-label.
//
// References:
//   - components/tag/index.md (canonical contract)
//   - WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Tag extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.tag")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "tag");
        span.setAttribute("role", "status");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
        passThroughAttributes(this, span, HANDLED);

        moveChildrenInto(this, span);
        this.appendChild(span);
    }
}
