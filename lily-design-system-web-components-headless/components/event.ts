// Event component
//
// An event card holding event-related information: an <article> for
// self-contained semantics, with consumer-supplied slots for title, date,
// time, location, and description.
//
// Attributes:
//   label — optional. Accessible name, via aria-label.
//   ...rest — spread onto the <article>.
//
// References:
//   - components/event/index.md (canonical contract)

import {
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
    followLabel,
} from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Event extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(): void {
        followLabel(this, "article.event", "event");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > article.event")) return;

        const article = document.createElement("article");
        article.className = rootClassName(this, "event");
        const label = this.getAttribute("label");
        if (label !== null) article.setAttribute("aria-label", label);
        passThroughAttributes(this, article, HANDLED);

        moveChildrenInto(this, article);
        this.appendChild(article);
    }
}
