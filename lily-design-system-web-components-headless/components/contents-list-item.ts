// ContentsListItem component — "upgrade in place" (see breadcrumb-list-item.ts
// for the full rationale). An <ol> may only contain <li> children, so this
// component builds the real <li>, moves the host's attributes/children into
// it, then replaces itself.
//
// No dedicated props: the canonical contract has no `current` prop of its
// own (unlike BreadcrumbListItem) — a consumer marking the current page
// sets `aria-current="page"` directly, which passes through as a plain
// rest attribute.
//
// Attributes:
//   ...rest — spread onto the <li> (including a consumer-supplied
//     aria-current). Children move into the <li> unchanged.
//
// References:
//   - components/contents-list-item/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED: ReadonlySet<string> = new Set();

export class ContentsListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;

        const li = document.createElement("li");
        li.className = rootClassName(this, "contents-list-item");
        passThroughAttributes(this, li, HANDLED);

        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}
