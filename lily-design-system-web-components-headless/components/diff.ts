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

import { applySelfClassName } from "../lib/dom-utils.js";

export class Diff extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "diff");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
