// SectionNav component
//
// A <nav> landmark for section navigation links. Composes SectionList >
// SectionListItem > SectionLink, following the Nav/List/ListItem
// composition pattern (see breadcrumb-nav for the shipped exemplar).
//
// Attributes:
//   label — REQUIRED. Accessible name for the landmark, via aria-label.
//
// References:
//   - components/section-nav/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class SectionNav extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > nav.section-nav")) return;

        const nav = document.createElement("nav");
        nav.className = rootClassName(this, "section-nav");
        const label = this.getAttribute("label");
        if (label !== null) nav.setAttribute("aria-label", label);
        passThroughAttributes(this, nav, HANDLED);

        moveChildrenInto(this, nav);
        this.appendChild(nav);
    }
}
