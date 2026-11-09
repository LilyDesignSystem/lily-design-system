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

import { applySelfClassName } from "../lib/dom-utils.js";

export class DescriptionListItem extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "description-list-item");
    }
}
