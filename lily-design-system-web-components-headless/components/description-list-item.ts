// DescriptionListItem component
//
// A plain <div> for one item's content inside a description list. The
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). The consumer's own light-DOM
// children (typically a <dt>/<dd> pair — valid per HTML5 inside a
// <dl>) stay exactly where they are.
//
// No `label`: a <div> is generic, and ARIA does not allow naming a generic
// element. The consumer's <dt> names the group.
//
// References:
//   - components/description-list-item/index.md (canonical contract)

import { applySelfClassName, followSelf } from "../lib/dom-utils.js";

export class DescriptionListItem extends HTMLElement {
    #built = false;

    // A change to class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["class"];
    }

    attributeChangedCallback(name: string): void {
        if (this.#built) followSelf(this, "description-list-item", name);
    }

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "description-list-item");
    }
}
