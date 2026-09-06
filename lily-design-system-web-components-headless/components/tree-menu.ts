// TreeMenu component
//
// A hierarchical tree menu with expandable branches: a <div role="tree">
// with keyboard navigation between `[role="treeitem"]` descendants
// (ArrowDown/ArrowUp move focus, wrapping; Home/End jump to first/last) —
// the same navigation TreeList implements for the *navigation-landmark*
// tree (see tree-list.ts). TreeMenu's own canonical doc documents only
// this up/down/home/end contract (no expand/collapse keys), matching the
// majority of the other headless catalogs (React, Svelte), which render a
// plain `<div role="tree">` with no `<ul>` — the "Renders a <ul>" line
// in the canonical Key Behaviors is a stray inconsistency against the
// doc's own HTML-tag metadata, Testing section, and every implementation.
// No native element behaviour is worth deferring to for a plain `<div>`,
// so the custom element instance itself stands in for the wrapper (see
// lib/dom-utils.applySelfClassName).
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
