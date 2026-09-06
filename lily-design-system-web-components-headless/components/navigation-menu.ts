// NavigationMenu component
//
// A site-wide navigation menu with links. Renders a native <nav>, which
// implicitly carries the navigation landmark role.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label, distinguishing this
//     nav landmark from others on the page.
//
// References:
//   - components/navigation-menu/index.md (canonical contract)
//   - WAI-ARIA Navigation Landmark: https://www.w3.org/TR/wai-aria-1.2/#navigation

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class NavigationMenu extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > nav.navigation-menu")) return;

        const nav = document.createElement("nav");
        nav.className = rootClassName(this, "navigation-menu");
        const label = this.getAttribute("label");
        if (label !== null) nav.setAttribute("aria-label", label);
        passThroughAttributes(this, nav, HANDLED);

        moveChildrenInto(this, nav);
        this.appendChild(nav);
    }
}
