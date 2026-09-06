// DescriptionList component
//
// A native <dl> displaying information in key-value (term/description)
// format. Children are typically DescriptionListItem components, each
// wrapping a term and its description(s) — note DescriptionListItem itself
// renders a <div>, not an <li>, since <dl> content is <dt>/<dd> pairs, not
// list items.
//
// Attributes:
//   label — optional. Accessible name, via aria-label.
//   ...rest — spread onto the <dl>.
//
// References:
//   - components/description-list/index.md (canonical contract)
//   - MDN dl element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class DescriptionList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > dl.description-list")) return;

        const dl = document.createElement("dl");
        dl.className = rootClassName(this, "description-list");
        const label = this.getAttribute("label");
        if (label !== null) dl.setAttribute("aria-label", label);
        passThroughAttributes(this, dl, HANDLED);

        moveChildrenInto(this, dl);
        this.appendChild(dl);
    }
}
