// DontList component
//
// A list of discouraged actions or practices to avoid, paired with DoList
// to form do/don't guidance patterns.
//
// Attributes:
//   label — optional, default "Don't". Accessible name, via aria-label.
//   ...rest — spread onto the <ul>.
//
// References:
//   - components/dont-list/index.md (canonical contract)
//   - MDN ul element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
//   - WAI list role: https://www.w3.org/WAI/ARIA/apd/roles/list/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class DontList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > ul.dont-list")) return;

        const ul = document.createElement("ul");
        ul.className = rootClassName(this, "dont-list");
        ul.setAttribute("role", "list");
        ul.setAttribute("aria-label", this.getAttribute("label") ?? "Don't");
        passThroughAttributes(this, ul, HANDLED);

        moveChildrenInto(this, ul);
        this.appendChild(ul);
    }
}
