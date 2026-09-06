// Hero component
//
// A large box or image with a title and description. Renders a native
// <section>, which is a labelled region landmark when aria-label is
// present.
//
// Attributes:
//   label — REQUIRED. Accessible name for the hero section, via aria-label.
//
// References:
//   - components/hero/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Hero extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > section.hero")) return;

        const section = document.createElement("section");
        section.className = rootClassName(this, "hero");
        const label = this.getAttribute("label");
        if (label !== null) section.setAttribute("aria-label", label);
        passThroughAttributes(this, section, HANDLED);

        moveChildrenInto(this, section);
        this.appendChild(section);
    }
}
