// Skeleton component
//
// A loading placeholder <div> — hidden entirely from screen readers
// (aria-hidden) but marked busy for the region it stands in for
// (aria-busy). The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName).
//
// No attributes beyond the class hook — children (placeholder shapes)
// are optional and kept in place.
//
// References:
//   - components/skeleton/index.md (canonical contract)
//   - WAI-ARIA aria-busy: https://www.w3.org/WAI/ARIA/apd/states/aria-busy/
//   - MDN aria-hidden: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden

import { applySelfClassName, followSelf } from "../lib/dom-utils.js";

export class Skeleton extends HTMLElement {
    #built = false;

    // A change to class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["class"];
    }

    attributeChangedCallback(name: string): void {
        if (this.#built) followSelf(this, "skeleton", name);
    }

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "skeleton");
        this.setAttribute("aria-hidden", "true");
        this.setAttribute("aria-busy", "true");
    }
}
