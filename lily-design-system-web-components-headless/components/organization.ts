// Organization component
//
// A self-contained organization entity. Renders a native <article>,
// which carries an implicit article role.
//
// Attributes:
//   label — optional. Accessible name, via aria-label.
//
// References:
//   - components/organization/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Organization extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > article.organization")) return;

        const article = document.createElement("article");
        article.className = rootClassName(this, "organization");
        const label = this.getAttribute("label");
        if (label !== null) article.setAttribute("aria-label", label);
        passThroughAttributes(this, article, HANDLED);

        moveChildrenInto(this, article);
        this.appendChild(article);
    }
}
