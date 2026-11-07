// tree-list/tree.js — the keys for the tree-list macro, which is markup only. Load it once and call `autoInit()`:
//
//   import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/tree-list/tree.js";
//   autoInit();
//
// WAI-ARIA APG tree view, with a roving tabindex so the tree is one tab stop. ArrowDown and ArrowUp move between
// visible items and wrap; Home and End jump. ArrowRight expands a closed branch, then moves to its first child;
// ArrowLeft collapses an open branch, else moves to the parent. Right-to-left swaps those two, from the item's
// computed direction. Expanding sets aria-expanded; hiding the children of a collapsed item is the consumer's CSS.

import { treeItemKey } from "../menu/menu-keys.js";

const ITEM = "[role='treeitem']";

/** Items not inside a collapsed parent. */
const visibleItems = (tree) =>
    [...tree.querySelectorAll(ITEM)].filter(
        (el) => !el.parentElement?.closest("[role='treeitem'][aria-expanded='false']"),
    );

/** Wire one tree. Returns a handle with `dispose()`. */
export function initTreeList(tree) {
    function rove(item) {
        for (const el of tree.querySelectorAll(ITEM)) el.tabIndex = el === item ? 0 : -1;
    }

    function onKeydown(event) {
        const items = visibleItems(tree);
        const active = tree.ownerDocument.activeElement;
        const index = items.indexOf(active);
        if (items.length === 0 || index < 0 || event.target !== active) return;
        const go = (item) => {
            event.preventDefault();
            item.focus();
        };
        const direction = tree.ownerDocument.defaultView.getComputedStyle(active).direction;
        const forward = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
        const expanded = active.getAttribute("aria-expanded");
        if (event.key === "Enter" || event.key === " " || event.key.length === 1)
            return treeItemKey(event, items);

        switch (event.key) {
            case "ArrowDown":
                go(items[(index + 1) % items.length]);
                break;
            case "ArrowUp":
                go(items[(index - 1 + items.length) % items.length]);
                break;
            case "Home":
                go(items[0]);
                break;
            case "End":
                go(items[items.length - 1]);
                break;
            case "ArrowRight":
            case "ArrowLeft":
                if (event.key === forward) {
                    if (expanded === "false") {
                        event.preventDefault();
                        active.setAttribute("aria-expanded", "true");
                    } else if (expanded === "true") {
                        const child = active.querySelector(ITEM);
                        if (child) go(child);
                    }
                } else if (expanded === "true") {
                    event.preventDefault();
                    active.setAttribute("aria-expanded", "false");
                } else {
                    const parent = active.parentElement?.closest(ITEM);
                    if (parent) go(parent);
                }
                break;
        }
    }
    function onFocusin(event) {
        const item = event.target.closest(ITEM);
        if (item) rove(item);
    }

    if (!tree.querySelector(`${ITEM}[tabindex='0']`)) {
        const first = visibleItems(tree)[0];
        if (first) rove(first);
    }
    tree.addEventListener("keydown", onKeydown);
    tree.addEventListener("focusin", onFocusin);
    return {
        dispose() {
            tree.removeEventListener("keydown", onKeydown);
            tree.removeEventListener("focusin", onFocusin);
        },
    };
}

/** Wire every root `.tree-list` on the page, once. */
export function autoInit(doc = document) {
    return [...doc.querySelectorAll(".tree-list[role='tree']")].map(initTreeList);
}
