// TreeMenu component
//
// A hierarchical tree menu with expandable branches, with keyboard
// navigation between `[role="treeitem"]` descendants (ArrowDown/ArrowUp
// move focus, wrapping; Home/End jump to first/last), the same navigation
// TreeList implements (see tree-list.ts). The contract's root is a
// <ul role="tree">; an autonomous custom element cannot be a <ul>, so the
// element itself carries role="tree" and the class hook (see
// lib/dom-utils.applySelfClassName), the catalog's documented limit for
// list roots. Give it role="treeitem" children, not bare <li>.
//
// Attributes:
//   label — REQUIRED. Accessible name via aria-label.
//
// Keyboard:
//   ArrowDown — focus the next tree item, wrapping to the first.
//   ArrowUp — focus the previous tree item, wrapping to the last.
//   Home — focus the first tree item.
//   End — focus the last tree item.
//
// References:
//   - components/tree-menu/index.md (canonical contract)
//   - WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/

import { applySelfClassName } from "../lib/dom-utils.js";

export class TreeMenu extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "tree-menu");
        this.setAttribute("role", "tree");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        this.addEventListener("keydown", this.#onKeydown);
    }

    #onKeydown = (event: KeyboardEvent): void => {
        const items = Array.from(this.querySelectorAll<HTMLElement>("[role='treeitem']"));
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
