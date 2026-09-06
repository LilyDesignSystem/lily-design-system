// MedicalBannerBoxForAdvice component
//
// A <div role="region"> for routine medical record advice information —
// contacts, contexts, care plans. The custom element stands in for the
// wrapper div directly (see lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//
// Always carries data-type="advice" for consumer CSS targeting.
//
// References:
//   - components/medical-banner-box-for-advice/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class MedicalBannerBoxForAdvice extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "medical-banner-box-for-advice");
        this.setAttribute("role", "region");
        this.setAttribute("data-type", "advice");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
