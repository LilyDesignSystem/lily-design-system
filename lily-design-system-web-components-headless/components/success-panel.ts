// SuccessPanel component
//
// A panel confirming a task has been completed. Renders a
// <div role="status">; the custom element stands in for that div directly
// (see lib/dom-utils.applySelfClassName) since <div> has no native
// behaviour worth preserving as a separate element.
//
// DEVIATION FLAG: the canonical AGENTS.md describes a fixed internal
// composition (a configurable heading, a `reference` line, `role="alert"`
// + `aria-live="polite"`) that none of the three cross-checked reference
// implementations (Svelte, React, Vue) actually build — all three render
// the simpler shape below (role="status", aria-label, plain children).
// This port follows the implemented cross-framework consensus.
//
// Attributes:
//   label — optional; aria-label for the panel.
//
// References:
//   - components/success-panel/index.md (canonical contract)
//   - GOV.UK Confirmation pages pattern: https://design-system.service.gov.uk/patterns/confirmation-pages/

import { applySelfClassName } from "../lib/dom-utils.js";

export class SuccessPanel extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "success-panel");
        this.setAttribute("role", "status");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
