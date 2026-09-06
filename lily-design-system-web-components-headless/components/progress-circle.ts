// ProgressCircle component
//
// A circular progress indicator: a <div role="progressbar"> with full
// ARIA value attributes, intended for CSS-driven radial rendering. The
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// KNOWN, ALREADY-DOCUMENTED CATALOG-WIDE DEFECT (fixed here, not
// introduced): this component's own AGENTS.md literally says
// `role="Progress"` (capital P, not a real ARIA role) in its Key
// Behaviors / ARIA / Acceptance Criteria sections. The
// svelte/react-headless canonical sources, this repo's own
// vue-nuxt-examples fix (CHANGELOG 2026-09-03, P7-T18), and the
// html-headless scaffold all agree the real role is the standard
// `role="progressbar"`. Implemented as `progressbar` here.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — default 0.
//   min — default 0.
//   max — default 100.
//   ...rest — spread naturally, since the host IS the rendered element.
//
// References:
//   - components/progress-circle/index.md (canonical contract)
//   - MDN role="progressbar": https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/progressbar_role

import { applySelfClassName } from "../lib/dom-utils.js";

export class ProgressCircle extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "progress-circle");
        this.setAttribute("role", "progressbar");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        this.setAttribute("aria-valuenow", this.getAttribute("value") ?? "0");
        this.setAttribute("aria-valuemin", this.getAttribute("min") ?? "0");
        this.setAttribute("aria-valuemax", this.getAttribute("max") ?? "100");
    }
}
