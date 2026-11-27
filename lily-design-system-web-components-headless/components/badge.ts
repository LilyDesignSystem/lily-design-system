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
import { LiveElement, setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["type", "label"]);

// A change to its attributes, or to class, is shown (tasks.md P50-T28).
export class Badge extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLSpanElement>(":scope > span.badge");
        const span = existing ?? document.createElement("span");
        span.className = rootClassName(this, "badge");
        span.setAttribute("role", "status");
        span.setAttribute("data-type", this.getAttribute("type") ?? "default");
        setOrRemove(span, "aria-label", this.getAttribute("label"));
        if (existing) return;
        passThroughAttributes(this, span, HANDLED);
        moveChildrenInto(this, span);
        this.appendChild(span);
    }
}
