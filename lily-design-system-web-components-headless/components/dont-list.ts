// DontList component
//
// A list of discouraged actions or practices to avoid, paired with DoList
// to form do/don't guidance patterns.
//
// Attributes:
//   label — required. Accessible name, via aria-label.
//   ...rest — spread onto the <ul>.
//
// References:
//   - components/dont-list/index.md (canonical contract)
//   - MDN ul element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
//   - WAI list role: https://www.w3.org/WAI/ARIA/apd/roles/list/

import {
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
    followLabel,
} from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class DontList extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(): void {
        followLabel(this, "ul.dont-list", "dont-list");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > ul.dont-list")) return;

        const ul = document.createElement("ul");
        ul.className = rootClassName(this, "dont-list");
        ul.setAttribute("role", "list");
        const label = this.getAttribute("label");
        if (label !== null) ul.setAttribute("aria-label", label);
        passThroughAttributes(this, ul, HANDLED);

        moveChildrenInto(this, ul);
        this.appendChild(ul);
    }
}
