// SectionList component
//
// A list of SectionListItem components, enumerating a section's pages,
// used inside SectionNav.
//
// Deviation from the canonical AGENTS.md "HTML tag" metadata field (which
// says <ol>): every real implementation (Svelte, React, html-headless)
// renders a <ul>. Followed the real cross-catalog implementation. The
// canonical AGENTS.md prop table also omits a `label` prop, but every
// implementation accepts one — included it to match the real contract.
//
// Attributes:
//   label — optional. Accessible name, via aria-label.
//   ...rest — spread onto the <ul>.
//
// References:
//   - components/section-list/index.md (canonical contract)
//   - MDN ul element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class SectionList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > ul.section-list")) return;

        const ul = document.createElement("ul");
        ul.className = rootClassName(this, "section-list");
        const label = this.getAttribute("label");
        if (label !== null) ul.setAttribute("aria-label", label);
        passThroughAttributes(this, ul, HANDLED);

        moveChildrenInto(this, ul);
        this.appendChild(ul);
    }
}
