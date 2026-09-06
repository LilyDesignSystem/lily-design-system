// DescriptionListItem component
//
// A plain <div> for one item's content inside a description list. The
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). The consumer's own light-DOM
// children (typically a <dt>/<dd> pair — valid per HTML5 inside a
// <dl>) stay exactly where they are.
//
// Deviation note: components/description-list-item/AGENTS.md's prose
// describes the component itself building a <dt>/<dd> pair from `term`
// / `description` props, but that shape is not what any of the actual
// cross-catalog implementations render (verified against
// lily-design-system-svelte-headless and lily-design-system-html-headless,
// both of which render exactly this: a plain div with an optional
// aria-label and a children slot, no dt/dd). Followed the real,
// consistently-implemented contract rather than the unimplemented prose.
//
// Attributes:
//   label — optional. Accessible label, via aria-label.
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
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
