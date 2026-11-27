// SummaryList component
//
// A <dl> presenting key-value summary pairs — order summaries, account
// settings, form review data, and similar. Children are typically <dt>/<dd>
// pairs or SummaryListItem components.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   ...rest — spread onto the <dl>.
//
// References:
//   - components/summary-list/index.md (canonical contract)
//   - MDN dl element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl

import {
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
    followLabel,
} from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class SummaryList extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(): void {
        followLabel(this, "dl.summary-list", "summary-list");
    }

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
