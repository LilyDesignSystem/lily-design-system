// Masonry component
//
// A masonry layout container for variable-height items, using the CSS
// multi-column approach. The custom element stands in for the wrapper
// div directly (see lib/dom-utils.applySelfClassName).
//
// DEVIATION FROM THE CANONICAL CONTRACT (flagged, not hidden): see
// flex-stack.ts's deviation note for the full reasoning — the canonical
// contract and every other port apply `column-count` / `column-gap` as
// an inline style, which this package's own AGENTS.md forbids adding as
// a second unapproved exception to the FloatButton-only inline-style
// rule. This implementation exposes `columns`/`gap` only via
// data-columns/data-gap for a consumer stylesheet to key off. Flagged
// for a maintainer decision on whether to add the inline-style
// exception catalog-wide.
//
// Attributes:
//   columns — number of columns, default "3". Exposed via data-columns
//     (NOT applied as inline `column-count` — see above).
//   gap — default "1rem". Exposed via data-gap.
//
// References:
//   - components/masonry/index.md (canonical contract)
//   - MDN column-count: https://developer.mozilla.org/en-US/docs/Web/CSS/column-count

import { applySelfClassName } from "../lib/dom-utils.js";

export class Masonry extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "masonry");
        this.setAttribute("data-columns", this.getAttribute("columns") ?? "3");
        this.setAttribute("data-gap", this.getAttribute("gap") ?? "1rem");
    }
}
