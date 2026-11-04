// menu/menu.js — the keys for the menu macro, which is markup only. Load it once and call `autoInit()`:
//
//   import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/menu/menu.js";
//   autoInit();
//
// APG menu, vertical: ArrowDown, ArrowUp, Home and End move and wrap, a typed letter jumps, one tab stop.

import { blockKeys, initRoving } from "../roving.js";

/** Wire one menu. Returns a handle with `dispose()`. */
export const initMenu = (root) =>
    initRoving(root, {
        selector: "[role='menuitem']",
        keys: () => blockKeys,
        rove: true,
        typeahead: true,
    });

/** Wire every `.menu` on the page, once. */
export function autoInit(doc = document) {
    return [...doc.querySelectorAll(".menu")].map(initMenu);
}
