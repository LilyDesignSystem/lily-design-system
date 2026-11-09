// SectionListItem component — "upgrade in place" (see breadcrumb-list-item.ts
// for the full rationale). A <ul> may only contain <li> children, so this
// component builds the real <li>, moves the host's attributes/children into
// it, then replaces itself.
//
// Follows the Svelte reference: `current` is a styling hook (data-current), and
// no `label`: an aria-label on the <li> would replace the link's own name.
//
// Attributes:
//   current — presence-based boolean; sets an empty data-current on the <li>.
//   ...rest — spread onto the <li>. Children move into the <li> unchanged.
//
// References:
//   - components/section-list-item/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["current"]);

export class SectionListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;

        const li = document.createElement("li");
        li.className = rootClassName(this, "section-list-item");
        if (this.hasAttribute("current")) li.setAttribute("data-current", "");
        passThroughAttributes(this, li, HANDLED);

        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}
