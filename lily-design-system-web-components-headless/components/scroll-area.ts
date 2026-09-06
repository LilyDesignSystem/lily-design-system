// ScrollArea component
//
// A focusable <div role="region"> providing keyboard accessibility for
// overflowing content. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName). No internal scroll
// logic — relies entirely on native browser scroll behaviour once the
// consumer applies CSS `overflow` and dimension properties.
//
// Attributes:
//   label — REQUIRED. Accessible name describing the scrollable
//     content, via aria-label.
//
// Keyboard: Tab focuses the container; Arrow Up/Down/Left/Right, Page
// Up/Down, and Home/End all scroll via native browser behaviour once
// focused — no JS required.
//
// References:
//   - components/scroll-area/index.md (canonical contract)
//   - WAI-ARIA Region Role: https://www.w3.org/TR/wai-aria-1.2/#region

import { applySelfClassName } from "../lib/dom-utils.js";

export class ScrollArea extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "scroll-area");
        this.setAttribute("role", "region");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        this.tabIndex = 0;
    }
}
