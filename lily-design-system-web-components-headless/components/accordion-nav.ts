// AccordionNav component
//
// A <nav> landmark wrapping an AccordionList so the whole accordion is
// announced as navigation. No interactive behaviour of its own — each
// accordion section (AccordionListItem, a <details>) manages its own
// open/closed state.
//
// Attributes:
//   label — REQUIRED. Accessible name for the nav landmark, via aria-label.
//
// Deviation from the canonical AGENTS.md "ARIA" field (which lists
// `role="region"` alongside aria-label): every real cross-catalog
// implementation (svelte, react, vue, html, blazor, nunjucks) renders a
// plain `<nav aria-label>` with no role override — adding role="region" to
// a <nav> would actually replace its implicit navigation landmark role,
// contradicting the same doc's own "Key Behaviors" ("announced as
// navigation"). Followed the real, unanimous cross-catalog contract.
//
// References:
//   - components/accordion-nav/index.md (canonical contract)
//   - WAI-ARIA Accordion Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class AccordionNav extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > nav.accordion-nav")) return;

        const nav = document.createElement("nav");
        nav.className = rootClassName(this, "accordion-nav");
        const label = this.getAttribute("label");
        if (label !== null) nav.setAttribute("aria-label", label);
        passThroughAttributes(this, nav, HANDLED);

        moveChildrenInto(this, nav);
        this.appendChild(nav);
    }
}
