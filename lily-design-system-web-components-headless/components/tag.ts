// Tag component
//
// A keyword label for categorizing content. Wraps a real
// <span role="status">.
//
// Attributes:
//   label — REQUIRED. Accessible label for screen readers: screen-reader
//     text (class screen-reader-span) by default, or aria-label when live.
//   live — presence-based boolean. Renders a role="status" live region, for
//     a tag whose text changes in place. Off by default.
//
// References:
//   - components/tag/index.md (canonical contract)
//   - WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "live"]);

export class Tag extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.tag")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "tag");
        const label = this.getAttribute("label");
        passThroughAttributes(this, span, HANDLED);
        if (this.hasAttribute("live")) {
            span.setAttribute("role", "status");
            if (label !== null) span.setAttribute("aria-label", label);
            moveChildrenInto(this, span);
        } else if (label) {
            // Not a live region: aria-label is not allowed on a plain <span>, so the label is screen-reader text appended after the content (the themes hide .screen-reader-span). The content stays exposed: it may hold a focusable control, such as a remove button.
            moveChildrenInto(this, span);
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = label;
            span.append(hidden);
        } else {
            moveChildrenInto(this, span);
        }
        this.appendChild(span);
    }
}
