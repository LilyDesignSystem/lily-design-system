// DoList component
//
// A list of recommended actions or best practices, paired with DontList to
// form do/don't guidance patterns.
//
// Attributes:
//   label — required. Accessible name, via aria-label.
//   ...rest — spread onto the <ul>.
//
// References:
//   - components/do-list/index.md (canonical contract)
//   - MDN ul element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
//   - WAI list role: https://www.w3.org/WAI/ARIA/apd/roles/list/

import {
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
    followLabel,
} from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class DoList extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(): void {
        followLabel(this, "ul.do-list", "do-list");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > ul.do-list")) return;

        const ul = document.createElement("ul");
        ul.className = rootClassName(this, "do-list");
        ul.setAttribute("role", "list");
        const label = this.getAttribute("label");
        if (label !== null) ul.setAttribute("aria-label", label);
        passThroughAttributes(this, ul, HANDLED);

        moveChildrenInto(this, ul);
        this.appendChild(ul);
    }
}
