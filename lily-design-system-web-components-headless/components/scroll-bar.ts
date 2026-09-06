// ScrollBar component
//
// A <div role="scrollbar"> track element for a custom scrollbar control.
// No native element behaviour is worth deferring to for a plain <div>, so
// the custom element instance itself stands in for the wrapper (see
// lib/dom-utils.applySelfClassName). The consumer provides the draggable
// thumb as light-DOM children and implements the drag/keyboard interaction
// that updates `aria-valuenow` — this component only sets the initial
// static ARIA scrollbar attributes (0/0/100), matching every other
// catalog's implementation (none wires up keyboard handling here; the
// canonical doc itself says "the consumer is responsible for implementing
// keyboard event handlers").
//
// Attributes:
//   orientation — "vertical" | "horizontal", default "vertical".
//   label — REQUIRED. Accessible name via aria-label.
//
// References:
//   - components/scroll-bar/index.md (canonical contract)
//   - WAI-ARIA scrollbar role: https://www.w3.org/TR/wai-aria-1.2/#scrollbar

import { applySelfClassName } from "../lib/dom-utils.js";

export class ScrollBar extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "scroll-bar");
        this.setAttribute("role", "scrollbar");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        const orientation = this.getAttribute("orientation") ?? "vertical";
        this.setAttribute("aria-orientation", orientation);
        this.setAttribute("aria-valuenow", "0");
        this.setAttribute("aria-valuemin", "0");
        this.setAttribute("aria-valuemax", "100");
    }
}
