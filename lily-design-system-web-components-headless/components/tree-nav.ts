// TreeNav component
//
// A <nav> landmark for hierarchical / tree-style navigation. Its own
// canonical doc is explicit that this component is "purely a structural
// wrapper" with "no internal state" — the actual `role="tree"` semantics
// and keyboard navigation (ArrowUp/ArrowDown/Home/End, already
// implemented) live on the nested TreeList (see tree-list.ts), matching
// breadcrumb-nav / section-nav's identical Nav/List/ListItem split.
//
// Attributes:
//   label — REQUIRED. Accessible name for the navigation landmark, via
//     aria-label.
//
// References:
//   - components/tree-nav/index.md (canonical contract)
//   - WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
//   - WAI-ARIA Navigation Role: https://www.w3.org/TR/wai-aria-1.2/#navigation

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class TreeNav extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > nav.tree-nav")) return;

        const nav = document.createElement("nav");
        nav.className = rootClassName(this, "tree-nav");
        const label = this.getAttribute("label");
        if (label !== null) nav.setAttribute("aria-label", label);
        passThroughAttributes(this, nav, HANDLED);

        moveChildrenInto(this, nav);
        this.appendChild(nav);
    }
}
