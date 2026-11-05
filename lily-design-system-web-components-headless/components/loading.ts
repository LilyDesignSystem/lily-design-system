// Loading component
//
// A live-region <div> announcing that content or an action is being
// processed. The custom element stands in for the wrapper div directly
// (see lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — accessible label for the loading state, via aria-label.
//     Required: the words are yours.
//
// References:
//   - components/loading/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class Loading extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "loading");
            this.setAttribute("role", "status");
            this.setAttribute("aria-live", "polite");
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
        else this.removeAttribute("aria-label");
    }
}
