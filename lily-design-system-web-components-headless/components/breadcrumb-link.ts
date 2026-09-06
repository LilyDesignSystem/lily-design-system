// BreadcrumbLink component
//
// A simple semantic <a> element for breadcrumb navigation. Designed to be
// used inside a BreadcrumbListItem.
//
// Attributes:
//   href — REQUIRED. The URL to navigate to.
//   label — optional accessible label override, via aria-label.
//   ...rest — spread onto the <a>.
//
// References:
//   - components/breadcrumb-link/index.md (canonical contract)
//   - WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["href", "label"]);

export class BreadcrumbLink extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > a.breadcrumb-link")) return;

        const a = document.createElement("a");
        a.className = rootClassName(this, "breadcrumb-link");
        const href = this.getAttribute("href");
        if (href !== null) a.href = href;
        const label = this.getAttribute("label");
        if (label !== null) a.setAttribute("aria-label", label);
        passThroughAttributes(this, a, HANDLED);

        moveChildrenInto(this, a);
        this.appendChild(a);
    }
}
