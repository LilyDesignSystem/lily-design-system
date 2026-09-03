// BackLink component
//
// A semantic <a> element representing backward navigation. Structurally
// identical to ActionLink; the distinction is purely semantic (the
// consumer chooses which to use based on what the link does).
//
// Attributes:
//   href — REQUIRED. The URL to navigate back to.
//   label — optional accessible label override, via aria-label.
//
// References:
//   - components/back-link/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["href", "label"]);

export class BackLink extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > a.back-link")) return;

        const a = document.createElement("a");
        a.className = rootClassName(this, "back-link");
        const href = this.getAttribute("href");
        if (href !== null) a.href = href;
        const label = this.getAttribute("label");
        if (label !== null) a.setAttribute("aria-label", label);
        passThroughAttributes(this, a, HANDLED);

        moveChildrenInto(this, a);
        this.appendChild(a);
    }
}
