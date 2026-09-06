// PaginationList component
//
// An ordered list of PaginationListItem components, intended to live inside
// a PaginationNav landmark (the nav usually supplies the accessible name,
// so `label` here is typically omitted).
//
// Attributes:
//   label — optional. Accessible name, via aria-label.
//   ...rest — spread onto the <ol>.
//
// References:
//   - components/pagination-list/index.md (canonical contract)
//   - HTML ol element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class PaginationList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > ol.pagination-list")) return;

        const ol = document.createElement("ol");
        ol.className = rootClassName(this, "pagination-list");
        const label = this.getAttribute("label");
        if (label !== null) ol.setAttribute("aria-label", label);
        passThroughAttributes(this, ol, HANDLED);

        moveChildrenInto(this, ol);
        this.appendChild(ol);
    }
}
