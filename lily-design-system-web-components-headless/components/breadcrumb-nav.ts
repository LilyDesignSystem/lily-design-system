// BreadcrumbNav component
//
// A <nav> landmark for a breadcrumb trail. Composes BreadcrumbList >
// BreadcrumbListItem (WAI-ARIA APG Breadcrumb pattern). Part of the
// P8-T7 pilot: the first *Nav/*List/*ListItem family in this catalog.
//
// Attributes:
//   label — REQUIRED. Accessible name for the landmark, via aria-label,
//     so multiple navs on a page are distinguishable (e.g. "Breadcrumb").
//
// References:
//   - components/breadcrumb-nav/index.md (canonical contract)
//   - WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class BreadcrumbNav extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > nav.breadcrumb-nav")) return;

        const nav = document.createElement("nav");
        nav.className = rootClassName(this, "breadcrumb-nav");
        const label = this.getAttribute("label");
        if (label !== null) nav.setAttribute("aria-label", label);
        passThroughAttributes(this, nav, HANDLED);

        moveChildrenInto(this, nav);
        this.appendChild(nav);
    }
}
