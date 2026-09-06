// PaginationLink component
//
// A simple semantic <a> element for pagination navigation. Designed to be
// used inside a PaginationListItem.
//
// Attributes:
//   href — REQUIRED. The URL to navigate to.
//   label — optional accessible label override, via aria-label.
//   ...rest — spread onto the <a>.
//
// References:
//   - components/pagination-link/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["href", "label"]);

export class PaginationLink extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > a.pagination-link")) return;

        const a = document.createElement("a");
        a.className = rootClassName(this, "pagination-link");
        const href = this.getAttribute("href");
        if (href !== null) a.href = href;
        const label = this.getAttribute("label");
        if (label !== null) a.setAttribute("aria-label", label);
        passThroughAttributes(this, a, HANDLED);

        moveChildrenInto(this, a);
        this.appendChild(a);
    }
}
