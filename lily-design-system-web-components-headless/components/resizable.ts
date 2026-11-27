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
import { setOrRemove } from "../lib/live-element.js";

export class Resizable extends HTMLElement {
    #built = false;

    // A change to label, direction or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["label", "direction", "class"];
    }

    attributeChangedCallback(name: string): void {
        if (!this.#built) return;
        if (name === "class") {
            if (!this.classList.contains("resizable")) applySelfClassName(this, "resizable");
            return;
        }
        setOrRemove(this, "aria-label", this.getAttribute("label"));
        this.setAttribute("data-resize", this.getAttribute("direction") ?? "both");
    }

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
