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
import { LiveElement } from "../lib/live-element.js";

// A change to phase, label or class is shown (tasks.md P50-T28); the rest of the banner is the consumer's children.
export class PhaseBanner extends LiveElement {
    #phase: HTMLElement | null = null;

    static get observedAttributes(): string[] {
        return ["phase", "label", "class"];
    }

    protected update(): void {
        applySelfClassName(this, "phase-banner");

        const label = this.getAttribute("label");
        if (label !== null) {
            this.setAttribute("role", "group");
            this.setAttribute("aria-label", label);
        } else this.removeAttribute("aria-label");

        const phase = this.getAttribute("phase");
        if (phase === null) {
            this.#phase?.remove();
            this.#phase = null;
            return;
        }
        if (!this.#phase) {
            this.#phase = document.createElement("strong");
            this.#phase.className = "phase-banner-phase";
            this.insertBefore(this.#phase, this.firstChild);
        }
        this.#phase.textContent = phase;
    }
}
