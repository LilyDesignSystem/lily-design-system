// widget-init.js — the keys for the toolbars and segment groups, whose macros are markup only. Load it once:
//
//   import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/widget-init.js";
//   autoInit();
//
// widget-keys.js is generated from shared/widget-keys.ts.

import { attachRadioGroup, attachToolbar } from "./widget-keys.js";

/** Wire every widget on the page, once. Returns the cleanups. */
export function autoInit(doc = document) {
    const all = (selector, wire) => [...doc.querySelectorAll(selector)].map(wire);
    return [
        ...all(".action-bar", (el) => attachToolbar(el, { dismiss: ".action-bar-clear" })),
        ...all(".action-group", (el) => attachToolbar(el)),
        ...all(".task-bar", (el) => attachToolbar(el)),
        ...all(".segment-group", attachRadioGroup),
    ];
}
