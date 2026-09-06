// Resizable component
//
// A focusable <div role="region"> that the user can resize by dragging.
// The custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). No internal resize logic — the
// consumer applies CSS `resize` and `overflow` based on `data-resize`.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   direction — "both" | "horizontal" | "vertical", default "both".
//     Exposed as data-resize.
//
// References:
//   - components/resizable/index.md (canonical contract)
//   - WAI-ARIA Window Splitter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

import { applySelfClassName } from "../lib/dom-utils.js";

export class Resizable extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "resizable");
        this.setAttribute("role", "region");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        this.tabIndex = 0;
        this.setAttribute("data-resize", this.getAttribute("direction") ?? "both");
    }
}
