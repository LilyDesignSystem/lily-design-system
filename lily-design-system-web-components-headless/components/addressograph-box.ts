// AddressographBox component
//
// A box that shows a person's identification details (name, tracking
// information, salient notations). A plain <div> — the custom element
// stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — optional. Accessible name via aria-label.
//   ...rest — spread onto `this` (the host is the rendered element).
//
// References:
//   - components/addressograph-box/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class AddressographBox extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "addressograph-box");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
