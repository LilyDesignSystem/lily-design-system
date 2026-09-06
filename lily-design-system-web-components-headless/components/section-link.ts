// SectionLink component
//
// One section link in the navigation.
//
// Attributes:
//   href — REQUIRED. Link target.
//   current — presence-based boolean; sets aria-current="page" when this
//     link represents the current page.
//   ...rest — spread onto the <a>.
//
// References:
//   - components/section-link/index.md (canonical contract)
//   - MDN aria-current: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["href", "current"]);

export class SectionLink extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > a.section-link")) return;

        const a = document.createElement("a");
        a.className = rootClassName(this, "section-link");
        const href = this.getAttribute("href");
        if (href !== null) a.href = href;
        if (this.hasAttribute("current")) a.setAttribute("aria-current", "page");
        passThroughAttributes(this, a, HANDLED);

        moveChildrenInto(this, a);
        this.appendChild(a);
    }
}
