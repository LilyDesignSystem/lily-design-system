// Caption component
//
// A native <figcaption>, as Svelte renders it, for use inside a <figure>
// (or <lily-figure>). The consumer's light-DOM children are moved into it.
// Known limitation: the <lily-caption> host sits between the <figure> and
// the <figcaption>, so a browser may not take the figure's name from it;
// give the figure aria-labelledby pointing at the caption's id. A table's
// caption is a native <caption> inside the table.
//
// Attributes: none beyond the base class + rest-props.
//
// References:
//   - components/caption/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set<string>([]);

export class Caption extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > figcaption.caption")) return;

        const figcaption = document.createElement("figcaption");
        figcaption.className = rootClassName(this, "caption");
        passThroughAttributes(this, figcaption, HANDLED);

        moveChildrenInto(this, figcaption);
        this.appendChild(figcaption);
    }
}
