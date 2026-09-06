// PaginationNav component
//
// A navigation landmark wrapping page navigation links (compose with a
// PaginationList of PaginationListItem elements, see AGENTS/components.md
// "Navigation pattern"). Renders a native <nav>.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label, distinguishing this
//     nav landmark from others on the page.
//
// References:
//   - components/pagination-nav/index.md (canonical contract)
//   - WAI-ARIA Navigation Role: https://www.w3.org/TR/wai-aria-1.2/#navigation

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class PaginationNav extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > nav.pagination-nav")) return;

        const nav = document.createElement("nav");
        nav.className = rootClassName(this, "pagination-nav");
        const label = this.getAttribute("label");
        if (label !== null) nav.setAttribute("aria-label", label);
        passThroughAttributes(this, nav, HANDLED);

        moveChildrenInto(this, nav);
        this.appendChild(nav);
    }
}
