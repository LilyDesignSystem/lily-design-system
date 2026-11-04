// tab-bar/tab-bar.js — the keys for the tab-bar macro, which is markup only. Load it once and call `autoInit()`:
//
//   import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/tab-bar/tab-bar.js";
//   autoInit();
//
// APG tabs with manual activation: the arrows, Home and End move focus, and a click, Enter or Space selects. The tab
// stop stays on the selected tab, so Tab into the bar lands there. Showing the panel is the consumer's.

import { blockKeys, initRoving, inlineKeys } from "../roving.js";

const TAB = "[role='tab']";

/** Wire one tab bar. Returns a handle with `dispose()`. */
export function initTabBar(root) {
    function select(tab) {
        for (const el of root.querySelectorAll(TAB)) {
            el.setAttribute("aria-selected", String(el === tab));
            el.tabIndex = el === tab ? 0 : -1;
        }
    }
    function onClick(event) {
        const tab = event.target.closest(TAB);
        if (tab && !tab.disabled) select(tab);
    }
    const roving = initRoving(root, {
        selector: TAB,
        keys: () =>
            root.getAttribute("aria-orientation") === "vertical" ? blockKeys : inlineKeys(root),
    });
    root.addEventListener("click", onClick);
    return {
        dispose() {
            roving.dispose();
            root.removeEventListener("click", onClick);
        },
    };
}

/** Wire every `.tab-bar` on the page, once. */
export function autoInit(doc = document) {
    return [...doc.querySelectorAll(".tab-bar")].map(initTabBar);
}
