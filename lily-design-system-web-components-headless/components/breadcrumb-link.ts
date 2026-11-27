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

import {
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
    followLink,
} from "../lib/dom-utils.js";

const HANDLED = new Set(["href", "label"]);

export class BreadcrumbLink extends HTMLElement {
    // A change to href, label or class is shown (tasks.md P50-T28); the link's text is the consumer's children.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        followLink(this, "a.breadcrumb-link", "breadcrumb-link");
    }

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
