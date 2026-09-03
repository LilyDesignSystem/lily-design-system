// Badge component
//
// A <span role="status"> for a small piece of status/count/label content.
//
// Attributes:
//   type — "default" | "info" | "success" | "warning" | "error", default
//     "default". Exposed as data-type.
//   label — optional accessible label override, via aria-label.
//
// References:
//   - components/badge/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["type", "label"]);

export class Badge extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.badge")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "badge");
        span.setAttribute("role", "status");
        span.setAttribute("data-type", this.getAttribute("type") ?? "default");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
        passThroughAttributes(this, span, HANDLED);

        moveChildrenInto(this, span);
        this.appendChild(span);
    }
}
