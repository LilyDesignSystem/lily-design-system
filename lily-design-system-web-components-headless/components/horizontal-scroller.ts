// HorizontalScroller component
//
// A horizontally scrollable content container with keyboard scrolling.
// The custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — REQUIRED. Accessible name for the scrollable region, via
//     aria-label.
//
// Keyboard: ArrowLeft / ArrowRight scroll the container horizontally
// when it (or a descendant) has focus; Home and End go to the start and
// the end, which is the left edge in right-to-left.
//
// References:
//   - components/horizontal-scroller/index.md (canonical contract)
//   - WAI-ARIA carousel pattern: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/

import { applySelfClassName } from "../lib/dom-utils.js";

const SCROLL_STEP = 40;

export class HorizontalScroller extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "horizontal-scroller");
            this.setAttribute("role", "region");
            this.tabIndex = 0;
            this.addEventListener("keydown", this.#onKeydown);
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }

    #onKeydown = (event: KeyboardEvent): void => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            this.scrollLeft += SCROLL_STEP;
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            this.scrollLeft -= SCROLL_STEP;
        } else if (event.key === "Home") {
            event.preventDefault();
            this.scrollLeft = 0;
        } else if (event.key === "End") {
            event.preventDefault();
            // scrollLeft runs from 0 down to a negative number in right-to-left.
            this.scrollLeft =
                getComputedStyle(this).direction === "rtl" ? -this.scrollWidth : this.scrollWidth;
        }
    };
}
