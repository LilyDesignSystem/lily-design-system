// menu/menu.js — the keys for the menu, dropdown-menu and context-menu macros, which are markup only. Load it once and call `autoInit()`:
//
//   import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/menu/menu.js";
//   autoInit();
//
// APG menu: menu-keys.js, generated from shared/menu-keys.ts, which says what a submenu's markup needs.

import { attachMenu } from "./menu-keys.js";

/** Wire one menu. Returns the cleanup. */
export const initMenu = (root) => attachMenu(root, "vertical");

/** Wire every `.menu`, `.dropdown-menu` and `.context-menu` on the page, once. */
export function autoInit(doc = document) {
    return [...doc.querySelectorAll(".menu, .dropdown-menu, .context-menu")].map(initMenu);
}
