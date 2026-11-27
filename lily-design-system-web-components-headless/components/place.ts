// Place component
//
// A self-contained place entity. Renders a native <article>, which
// carries an implicit article role.
//
// Attributes:
//   label — optional. Accessible name, via aria-label.
//
// References:
//   - components/place/index.md (canonical contract)

import {
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
    followLabel,
} from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Place extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(): void {
        followLabel(this, "article.place", "place");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > article.place")) return;

        const article = document.createElement("article");
        article.className = rootClassName(this, "place");
        const label = this.getAttribute("label");
        if (label !== null) article.setAttribute("aria-label", label);
        passThroughAttributes(this, article, HANDLED);

        moveChildrenInto(this, article);
        this.appendChild(article);
    }
}
