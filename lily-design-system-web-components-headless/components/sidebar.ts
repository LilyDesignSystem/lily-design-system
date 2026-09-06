// Sidebar component
//
// A complementary <aside> region for navigation menus, filters, or other
// supplementary content alongside the main content.
//
// Attributes:
//   label — REQUIRED. Accessible name for the sidebar region, via
//     aria-label.
//
// References:
//   - components/sidebar/index.md (canonical contract)
//   - WAI-ARIA Complementary Role: https://www.w3.org/TR/wai-aria-1.2/#complementary

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Sidebar extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > aside.sidebar")) return;

        const aside = document.createElement("aside");
        aside.className = rootClassName(this, "sidebar");
        const label = this.getAttribute("label");
        if (label !== null) aside.setAttribute("aria-label", label);
        passThroughAttributes(this, aside, HANDLED);

        moveChildrenInto(this, aside);
        this.appendChild(aside);
    }
}
