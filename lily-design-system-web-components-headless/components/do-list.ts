// DoList component
//
// A list of recommended actions or best practices, paired with DontList to
// form do/don't guidance patterns.
//
// Attributes:
//   label — optional, default "Do". Accessible name, via aria-label.
//   ...rest — spread onto the <ul>.
//
// References:
//   - components/do-list/index.md (canonical contract)
//   - MDN ul element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
//   - WAI list role: https://www.w3.org/WAI/ARIA/apd/roles/list/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class DoList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > ul.do-list")) return;

        const ul = document.createElement("ul");
        ul.className = rootClassName(this, "do-list");
        ul.setAttribute("role", "list");
        ul.setAttribute("aria-label", this.getAttribute("label") ?? "Do");
        passThroughAttributes(this, ul, HANDLED);

        moveChildrenInto(this, ul);
        this.appendChild(ul);
    }
}
