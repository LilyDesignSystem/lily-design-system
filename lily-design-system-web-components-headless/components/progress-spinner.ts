// ProgressSpinner component
//
// An indeterminate loading indicator: a <div role="status"
// aria-live="polite">. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName). Unlike ProgressCircle
// (a specific percentage), this indicates an ongoing process of unknown
// duration, so it carries no aria-value* attributes.
//
// Attributes:
//   label — REQUIRED. Accessible name describing the loading state, via
//     aria-label.
//
// References:
//   - components/progress-spinner/index.md (canonical contract)
//   - WAI-ARIA status role: https://www.w3.org/WAI/ARIA/apd/roles/status/

import { applySelfClassName } from "../lib/dom-utils.js";

export class ProgressSpinner extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "progress-spinner");
        this.setAttribute("role", "status");
        this.setAttribute("aria-live", "polite");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
