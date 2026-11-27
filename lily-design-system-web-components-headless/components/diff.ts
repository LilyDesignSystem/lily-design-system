// Diff component
//
// A side-by-side comparison of two items: a <div role="group"> wrapping
// the consumer's two comparison panels. The custom element stands in
// for the wrapper div directly (see lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — REQUIRED. Accessible name describing the comparison, via
//     aria-label.
//
// References:
//   - components/diff/index.md (canonical contract)
//   - WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group

import { applySelfClassName, followSelf } from "../lib/dom-utils.js";

export class Diff extends HTMLElement {
    #built = false;

    // A change to label or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(name: string): void {
        if (this.#built) followSelf(this, "diff", name);
    }

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "diff");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
