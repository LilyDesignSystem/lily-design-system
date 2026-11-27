// CollectionList component
//
// A compact list of multiple related items — articles, events, and similar
// — typically containing CollectionListItem children.
//
// Attributes:
//   label — optional. Accessible name, via aria-label.
//   ...rest — spread onto the <ul>.
//
// References:
//   - components/collection-list/index.md (canonical contract)
//   - US Web Design System Collection: https://designsystem.digital.gov/components/collection/

import {
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
    followLabel,
} from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class CollectionList extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(): void {
        followLabel(this, "ul.collection-list", "collection-list");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > ul.collection-list")) return;

        const ul = document.createElement("ul");
        ul.className = rootClassName(this, "collection-list");
        const label = this.getAttribute("label");
        if (label !== null) ul.setAttribute("aria-label", label);
        passThroughAttributes(this, ul, HANDLED);

        moveChildrenInto(this, ul);
        this.appendChild(ul);
    }
}
