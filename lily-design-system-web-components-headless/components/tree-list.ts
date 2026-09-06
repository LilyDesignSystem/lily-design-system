// TreeList component
//
// A hierarchical list using the ARIA tree role with keyboard navigation
// between `[role="treeitem"]` descendants: ArrowDown/ArrowUp move focus
// (wrapping), Home/End jump to the first/last item. For a fully labelled
// tree landmark, wrap this inside TreeNav.
//
// Attributes:
//   label — REQUIRED. Accessible name for the tree, via aria-label.
//   ...rest — spread onto the <ol>.
//
// Keyboard:
//   ArrowDown — focus the next tree item, wrapping to the first.
//   ArrowUp — focus the previous tree item, wrapping to the last.
//   Home — focus the first tree item.
//   End — focus the last tree item.
//
// References:
//   - components/tree-list/index.md (canonical contract)
//   - WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
//   - WAI-ARIA tree role: https://www.w3.org/TR/wai-aria-1.2/#tree

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class TreeList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > ol.tree-list")) return;

        const ol = document.createElement("ol");
        ol.className = rootClassName(this, "tree-list");
        ol.setAttribute("role", "tree");
        const label = this.getAttribute("label");
        if (label !== null) ol.setAttribute("aria-label", label);
        passThroughAttributes(this, ol, HANDLED);
        ol.addEventListener("keydown", this.#onKeydown);

        moveChildrenInto(this, ol);
        this.appendChild(ol);
    }

    #onKeydown = (event: KeyboardEvent): void => {
        const ol = event.currentTarget as HTMLOListElement;
        const items = Array.from(ol.querySelectorAll<HTMLElement>("[role='treeitem']"));
        const current = document.activeElement as HTMLElement;
        const index = items.indexOf(current);
        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                const next = index < items.length - 1 ? index + 1 : 0;
                items[next]?.focus();
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : items.length - 1;
                items[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                items[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                items[items.length - 1]?.focus();
                break;
            }
        }
    };
}
