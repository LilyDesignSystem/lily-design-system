// DialGroup component
//
// A <div role="group"> that semantically groups a set of Dial
// components. No native element behaviour is worth deferring to for a
// plain <div>, so the custom element instance itself stands in for the
// wrapper (see lib/dom-utils.applySelfClassName). Individual dials
// handle their own keyboard interaction; there is none at the group
// level.
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//
// References:
//   - components/dial-group/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class DialGroup extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "dial-group");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
