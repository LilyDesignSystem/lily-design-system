// Answer component
//
// An answer is anything that responds to a question, request, action, etc.
// A plain <div> — the custom element stands in for the wrapper div directly
// (see lib/dom-utils.applySelfClassName). Pairs naturally with the Question
// component for Q&A patterns.
//
// Attributes:
//   label — optional. Accessible name via aria-label, for screen readers
//     when no visible heading is present.
//
// References:
//   - components/answer/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class Answer extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "answer");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
