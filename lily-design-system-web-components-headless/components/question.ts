// Question component
//
// A <div class="question"> for content that asks for information,
// invites a response, or tests knowledge — pairs naturally with the
// Answer component for Q&A patterns. The custom element stands in for
// the wrapper div directly (see lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — optional. Accessible label, via aria-label, for when no
//     visible heading is present.
//
// References:
//   - components/question/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class Question extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "question");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
