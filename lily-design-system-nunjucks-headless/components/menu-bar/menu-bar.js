// menu-bar/menu-bar.js — the keys for the menu-bar macro, which is markup only. Load it once and call `autoInit()`:
//
//   import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/menu-bar/menu-bar.js";
//   autoInit();
//
// APG menubar: ArrowRight, ArrowLeft, Home and End move and wrap, swapped in right-to-left; a typed letter jumps; one
// tab stop.

import { initRoving, inlineKeys } from "../roving.js";

/** Wire one menu bar. Returns a handle with `dispose()`. */
export const initMenuBar = (root) =>
    initRoving(root, {
        selector: "[role='menuitem']",
        keys: () => inlineKeys(root),
        rove: true,
        typeahead: true,
    });

/** Wire every `.menu-bar` on the page, once. */
export function autoInit(doc = document) {
    return [...doc.querySelectorAll(".menu-bar")].map(initMenuBar);
}
