// Person component
//
// A self-contained person entity. Renders a native <article>, which
// carries an implicit article role.
//
// Attributes:
//   label — optional. Accessible name, via aria-label.
//
// References:
//   - components/person/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Person extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > article.person")) return;

        const article = document.createElement("article");
        article.className = rootClassName(this, "person");
        const label = this.getAttribute("label");
        if (label !== null) article.setAttribute("aria-label", label);
        passThroughAttributes(this, article, HANDLED);

        moveChildrenInto(this, article);
        this.appendChild(article);
    }
}
