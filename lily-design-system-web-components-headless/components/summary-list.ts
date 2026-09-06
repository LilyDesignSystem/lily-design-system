// SummaryList component
//
// A <dl> presenting key-value summary pairs — order summaries, account
// settings, form review data, and similar. Children are typically <dt>/<dd>
// pairs or SummaryListItem components.
//
// Deviation from the canonical AGENTS.md "HTML tag" metadata field (which
// says <ol>): every real implementation (Svelte, React) renders a <dl>,
// matching the "Key Behaviors" prose. Followed the real cross-catalog
// implementation, which also matches the description-list-shaped content
// this component actually holds.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   ...rest — spread onto the <dl>.
//
// References:
//   - components/summary-list/index.md (canonical contract)
//   - MDN dl element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class SummaryList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > dl.summary-list")) return;

        const dl = document.createElement("dl");
        dl.className = rootClassName(this, "summary-list");
        const label = this.getAttribute("label");
        if (label !== null) dl.setAttribute("aria-label", label);
        passThroughAttributes(this, dl, HANDLED);

        moveChildrenInto(this, dl);
        this.appendChild(dl);
    }
}
