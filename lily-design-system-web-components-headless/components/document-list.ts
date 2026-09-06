// DocumentList component
//
// A list of DocumentListItem components — downloadable or related documents
// such as PDFs, attachments, or references.
//
// Deviation from the canonical AGENTS.md "HTML tag" metadata field (which
// says <ol>): every real implementation (Svelte, React) renders a <ul>.
// Followed the real cross-catalog implementation.
//
// Attributes:
//   label — optional. Accessible name, via aria-label.
//   ...rest — spread onto the <ul>.
//
// References:
//   - components/document-list/index.md (canonical contract)
//   - MDN ul element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class DocumentList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > ul.document-list")) return;

        const ul = document.createElement("ul");
        ul.className = rootClassName(this, "document-list");
        const label = this.getAttribute("label");
        if (label !== null) ul.setAttribute("aria-label", label);
        passThroughAttributes(this, ul, HANDLED);

        moveChildrenInto(this, ul);
        this.appendChild(ul);
    }
}
