// Panel component
//
// A generic content panel with an accessible label, rendered as a
// <section> — the real HTML tag per the canonical contract (the
// AGENTS.md metadata table says <div>, but the actual Svelte/React/HTML
// implementations agree on <section>, since a labelled <section> becomes
// a named region landmark that assistive technology can list and
// navigate to).
//
// Attributes:
//   label — REQUIRED. Accessible name for the panel region, via
//     aria-label.
//   ...rest — spread onto the <section>.
//
// References:
//   - components/panel/index.md (canonical contract)
//   - HTML section element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section
//   - WAI Landmarks: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Panel extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > section.panel")) return;

        const section = document.createElement("section");
        section.className = rootClassName(this, "panel");
        const label = this.getAttribute("label");
        if (label !== null) section.setAttribute("aria-label", label);
        passThroughAttributes(this, section, HANDLED);

        moveChildrenInto(this, section);
        this.appendChild(section);
    }
}
