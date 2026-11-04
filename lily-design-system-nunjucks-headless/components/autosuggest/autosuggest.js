// autosuggest/autosuggest.js — the behaviour for the autosuggest macro, which is markup only: the same keys as combobox.
//
//   import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/autosuggest/autosuggest.js";
//   autoInit();
//
// Choosing writes the value into the input and dispatches a bubbling "autosuggest-select" with detail.value; closing
// dispatches "autosuggest-close". Filtering is the consumer's.

import { initCombobox } from "../combobox/combobox.js";

export const initAutosuggest = (root) => initCombobox(root, "autosuggest");

/** Wire every `.autosuggest` on the page, once. */
export function autoInit(doc = document) {
    return [...doc.querySelectorAll(".autosuggest")].map(initAutosuggest).filter(Boolean);
}
