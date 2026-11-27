// RelatedContent component
//
// An <aside> complementary landmark listing links to related or
// supporting information.
//
// Note on scope: the canonical AGENTS.md documents a `title` (required
// heading text) + `headingLevel` contract with a rendered heading tied
// via aria-labelledby. Every other headless catalog (React, Svelte, Vue,
// Blazor, HTML) implements a plain `<aside aria-label>` wrapper with no
// heading element at all — a real, catalog-wide inconsistency between the
// doc and every implementation. This follows the cross-catalog majority.
//
// Attributes:
//   label — optional. Accessible name for the aside, via aria-label.
//
// References:
//   - components/related-content/index.md (canonical contract)

import {
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
    followLabel,
} from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class RelatedContent extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(): void {
        followLabel(this, "aside.related-content", "related-content");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > aside.related-content")) return;

        const aside = document.createElement("aside");
        aside.className = rootClassName(this, "related-content");
        const label = this.getAttribute("label");
        if (label !== null) aside.setAttribute("aria-label", label);
        passThroughAttributes(this, aside, HANDLED);

        moveChildrenInto(this, aside);
        this.appendChild(aside);
    }
}
