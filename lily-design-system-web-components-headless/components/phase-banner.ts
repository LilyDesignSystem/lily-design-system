// PhaseBanner component
//
// A <div> showing the service's development phase (e.g. "Alpha", "Beta")
// and inviting feedback. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName). No role by default —
// this is meta-information about the service, not a landmark.
//
// Attributes:
//   phase — REQUIRED. Phase label, e.g. "Alpha", "Beta", "Live". Rendered
//     in <strong class="phase-banner-phase"> before the existing content.
//
// References:
//   - components/phase-banner/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class PhaseBanner extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "phase-banner");

        const phase = this.getAttribute("phase");
        if (phase !== null) {
            const strong = document.createElement("strong");
            strong.className = "phase-banner-phase";
            strong.textContent = phase;
            this.insertBefore(strong, this.firstChild);
        }
    }
}
