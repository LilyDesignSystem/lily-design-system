// MedicalBannerBoxForDanger component
//
// A <div role="region"> for critical medical record danger information —
// reactions, warnings, alarms. The custom element stands in for the
// wrapper div directly (see lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//
// Always carries data-type="danger" for consumer CSS targeting.
//
// References:
//   - components/medical-banner-box-for-danger/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class MedicalBannerBoxForDanger extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "medical-banner-box-for-danger");
        this.setAttribute("role", "region");
        this.setAttribute("data-type", "danger");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
