// BannerBox component
//
// A flexbox-horizontal box intended to be placed inside a Banner. A plain
// <div> — the custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). The parent Banner provides the
// landmark role and the aria-live region; this component contributes only
// the layout container.
//
// Attributes:
//   label — optional. Accessible name via aria-label.
//
// References:
//   - components/banner-box/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class BannerBox extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "banner-box");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
