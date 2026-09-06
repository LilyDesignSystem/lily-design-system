// Grid component
//
// A headless CSS grid layout container with a configurable number of
// columns and gap. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName).
//
// DEVIATION FROM THE CANONICAL CONTRACT (flagged, not hidden): see
// flex-stack.ts's deviation note for the full reasoning — the canonical
// contract and every other port apply `display: grid` /
// `grid-template-columns` / `gap` as an inline style, which this
// package's own AGENTS.md forbids adding as a second unapproved
// exception to the FloatButton-only inline-style rule. This
// implementation exposes `columns`/`gap` only via data-columns/data-gap
// for a consumer stylesheet to key off. Flagged for a maintainer
// decision on whether to add the inline-style exception catalog-wide.
//
// Attributes:
//   columns — number or custom grid-template-columns string, default
//     "12". Exposed via data-columns verbatim (NOT expanded into
//     `repeat(N, minmax(0, 1fr))` inline style — see above).
//   gap — default "1rem". Exposed via data-gap.
//
// References:
//   - components/grid/index.md (canonical contract)
//   - MDN CSS grid: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout

import { applySelfClassName } from "../lib/dom-utils.js";

export class Grid extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "grid");
        this.setAttribute("data-columns", this.getAttribute("columns") ?? "12");
        this.setAttribute("data-gap", this.getAttribute("gap") ?? "1rem");
    }
}
