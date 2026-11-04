// command/command.js — the keys for the command macro, which is markup only. Load it once and call `autoInit()`:
//
//   import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/command/command.js";
//   autoInit();
//
// command-keys.js is generated from shared/command-keys.ts. What an option does is yours: listen for its click.

import { attachCommand } from "./command-keys.js";

/** Wire one command palette. Returns the cleanup. */
export function initCommand(root) {
    const input = root.querySelector('input[type="search"]');
    const list = input && root.ownerDocument.getElementById(input.getAttribute("aria-controls"));
    return list ? attachCommand(input, list) : null;
}

/** Wire every `.command` on the page, once. */
export function autoInit(doc = document) {
    return [...doc.querySelectorAll(".command")].map(initCommand).filter(Boolean);
}
