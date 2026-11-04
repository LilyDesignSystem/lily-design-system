// menu-bar/menu-bar.js — the keys for the menu-bar macro, which is markup only. Load it once and call `autoInit()`:
//
//   import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/menu-bar/menu-bar.js";
//   autoInit();
//
// APG menubar: menu-keys.js, generated from shared/menu-keys.ts, which says what a submenu's markup needs.

import { attachMenu } from "../menu/menu-keys.js";

/** Wire one menu bar. Returns the cleanup. */
export const initMenuBar = (root) => attachMenu(root, "horizontal");

/** Wire every `.menu-bar` on the page, once. */
export function autoInit(doc = document) {
    return [...doc.querySelectorAll(".menu-bar")].map(initMenuBar);
}
