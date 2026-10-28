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
//   min-column-width — optional CSS length. When set, the generated template
//     `repeat(auto-fit, minmax(min(<W>, 100%), 1fr))` is exposed as the CSS
//     custom property `--grid-template-columns` (a custom property is the
//     sanctioned inline-style channel; no raw property is set) and
//     data-min-column-width mirrors <W>. Consumer CSS applies it with
//     `grid-template-columns: var(--grid-template-columns)`. Wins over columns.
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
        const min = this.getAttribute("min-column-width");
        if (min) {
            this.setAttribute("data-min-column-width", min);
            this.style.setProperty(
                "--grid-template-columns",
                `repeat(auto-fit, minmax(min(${min}, 100%), 1fr))`,
            );
        }
        this.setAttribute("data-gap", this.getAttribute("gap") ?? "1rem");
    }
}
