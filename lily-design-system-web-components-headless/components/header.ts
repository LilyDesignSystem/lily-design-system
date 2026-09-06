// Header component
//
// A page or section header area. Renders a native <header>, which
// implicitly carries role="banner" when it is a direct child of <body>.
//
// Attributes:
//   label — optional. Accessible name, via aria-label; useful when a page
//     has multiple header regions.
//
// References:
//   - components/header/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Header extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > header.header")) return;

        const header = document.createElement("header");
        header.className = rootClassName(this, "header");
        const label = this.getAttribute("label");
        if (label !== null) header.setAttribute("aria-label", label);
        passThroughAttributes(this, header, HANDLED);

        moveChildrenInto(this, header);
        this.appendChild(header);
    }
}
