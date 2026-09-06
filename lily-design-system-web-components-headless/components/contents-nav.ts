// ContentsNav component
//
// A navigation landmark for a table of contents: a <nav> wrapping a
// ContentsList of ContentsListItem entries.
//
// Attributes:
//   label — REQUIRED. Accessible name for the navigation landmark (e.g.
//     "Contents", "On this page"), via aria-label.
//   ...rest — spread onto the <nav>.
//
// References:
//   - components/contents-nav/index.md (canonical contract)
//   - WAI-ARIA Navigation Landmark: https://www.w3.org/WAI/ARIA/apg/patterns/landmark-regions/
//   - MDN nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class ContentsNav extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > nav.contents-nav")) return;

        const nav = document.createElement("nav");
        nav.className = rootClassName(this, "contents-nav");
        const label = this.getAttribute("label");
        if (label !== null) nav.setAttribute("aria-label", label);
        passThroughAttributes(this, nav, HANDLED);

        moveChildrenInto(this, nav);
        this.appendChild(nav);
    }
}
