// PhotoPack component
//
// A <div role="group"> collecting multiple FeaturePhoto (or similar)
// components together. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName). Layout (grid, masonry,
// row) is entirely the consumer's CSS.
//
// Attributes:
//   label — REQUIRED. Accessible label for the photo collection, via
//     aria-label.
//
// References:
//   - components/photo-pack/index.md (canonical contract)

import { applySelfClassName, followSelf } from "../lib/dom-utils.js";

export class PhotoPack extends HTMLElement {
    #built = false;

    // A change to label or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(name: string): void {
        if (this.#built) followSelf(this, "photo-pack", name);
    }

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "photo-pack");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
