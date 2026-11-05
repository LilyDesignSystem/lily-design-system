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
//   ArrowRight — expand a collapsed branch, or move to the first child of an expanded one.
//   ArrowLeft — collapse an expanded branch, or move to the parent. Both are swapped in right-to-left.
//
// References:
//   - components/tree-list/index.md (canonical contract)
//   - WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
//   - WAI-ARIA tree role: https://www.w3.org/TR/wai-aria-1.2/#tree

import { treeItemKey } from "../lib/menu-keys.js";
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
        const items = Array.from(ol.querySelectorAll<HTMLElement>("[role='treeitem']")).filter(
            (el) => !el.parentElement?.closest("[role='treeitem'][aria-expanded='false']"),
        );
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
            default:
                treeItemKey(event, items);
                break;
            case "ArrowRight":
            case "ArrowLeft":
                if (event.target === current && index >= 0) this.#expandKey(event, current);
                break;
        }
    };

    // ArrowRight expands a branch or enters it; ArrowLeft collapses it or moves to the parent. Swapped in right-to-left.
    #expandKey(event: KeyboardEvent, item: HTMLElement): void {
        const rtl = getComputedStyle(item).direction === "rtl";
        const expanded = item.getAttribute("aria-expanded");
        const target =
            event.key === (rtl ? "ArrowLeft" : "ArrowRight")
                ? expanded === "true"
                    ? item.querySelector<HTMLElement>("[role='treeitem']")
                    : null
                : expanded === "true"
                  ? null
                  : (item.parentElement?.closest<HTMLElement>("[role='treeitem']") ?? null);
        if (target) {
            event.preventDefault();
            target.focus();
        } else if (
            expanded !== null &&
            (event.key === (rtl ? "ArrowLeft" : "ArrowRight")) === (expanded === "false")
        ) {
            event.preventDefault();
            item.setAttribute("aria-expanded", String(expanded === "false"));
        }
    }
}
