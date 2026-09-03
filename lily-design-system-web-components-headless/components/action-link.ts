// ActionLink component
//
// A simple semantic <a> element for a navigation action.
//
// Attributes:
//   href — REQUIRED. The URL the link points to.
//   label — optional accessible label override, via aria-label.
//
// References:
//   - components/action-link/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["href", "label"]);

export class ActionLink extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > a.action-link")) return;

        const a = document.createElement("a");
        a.className = rootClassName(this, "action-link");
        const href = this.getAttribute("href");
        if (href !== null) a.href = href;
        const label = this.getAttribute("label");
        if (label !== null) a.setAttribute("aria-label", label);
        passThroughAttributes(this, a, HANDLED);

        moveChildrenInto(this, a);
        this.appendChild(a);
    }
}
