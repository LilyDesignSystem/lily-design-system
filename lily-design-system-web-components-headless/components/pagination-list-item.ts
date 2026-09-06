// PaginationListItem component — "upgrade in place" (see
// breadcrumb-list-item.ts for the full rationale). An <ol> may only contain
// <li> children, so this component builds the real <li>, moves the host's
// attributes/children into it, then replaces itself.
//
// No dedicated props: the consumer's link/button content carries its own
// aria-current="page" when relevant, passing through unchanged.
//
// Attributes:
//   ...rest — spread onto the <li>. Children move into the <li> unchanged.
//
// References:
//   - components/pagination-list-item/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED: ReadonlySet<string> = new Set();

export class PaginationListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;

        const li = document.createElement("li");
        li.className = rootClassName(this, "pagination-list-item");
        passThroughAttributes(this, li, HANDLED);

        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}
