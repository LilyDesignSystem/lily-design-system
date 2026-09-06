// MedicalBannerBox component
//
// A flexbox-horizontal <div> intended to sit inside a MedicalBanner,
// grouping related medical information (e.g. patient name, NHS number).
// The custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — optional. Accessible name, via aria-label.
//   ...rest — remaining attributes stay on the host, which is itself the
//     rendered element (self-is-the-wrapper).
//
// Always carries data-context="medical" for consumer CSS targeting.
//
// References:
//   - components/medical-banner-box/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class MedicalBannerBox extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "medical-banner-box");
        this.setAttribute("data-context", "medical");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
