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

import { applySelfClassName, followSelf } from "../lib/dom-utils.js";

export class Question extends HTMLElement {
    #built = false;

    // A change to label or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(name: string): void {
        if (this.#built) followSelf(this, "question", name, "group");
    }

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "question");
        const label = this.getAttribute("label");
        if (label !== null) {
            this.setAttribute("aria-label", label);
            if (!this.hasAttribute("role")) this.setAttribute("role", "group");
        }
    }
}
