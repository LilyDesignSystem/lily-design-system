// TreeLink component
//
// A simple semantic <a> element for tree navigation. Designed to be used
// inside a TreeListItem.
//
// Attributes:
//   href — REQUIRED. The URL to navigate to.
//   label — optional accessible label override, via aria-label.
//   ...rest — spread onto the <a>.
//
// References:
//   - components/tree-link/index.md (canonical contract)
//   - WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["href", "label"]);

export class TreeLink extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > a.tree-link")) return;

        const a = document.createElement("a");
        a.className = rootClassName(this, "tree-link");
        const href = this.getAttribute("href");
        if (href !== null) a.href = href;
        const label = this.getAttribute("label");
        if (label !== null) a.setAttribute("aria-label", label);
        passThroughAttributes(this, a, HANDLED);

        moveChildrenInto(this, a);
        this.appendChild(a);
    }
}
