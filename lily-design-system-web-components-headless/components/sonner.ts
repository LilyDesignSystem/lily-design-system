// Sonner component
//
// A toast notification region: a <div role="region" aria-live="polite">
// named landmark where the consumer appends individual toast elements.
// The custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). No internal state — purely a
// structural wrapper; the consumer manages toast lifecycle.
//
// Attributes:
//   label — REQUIRED. Accessible name identifying the notification
//     area, via aria-label.
//
// References:
//   - components/sonner/index.md (canonical contract)
//   - WAI-ARIA Live Regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live
//   - WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region

import { applySelfClassName } from "../lib/dom-utils.js";

export class Sonner extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "sonner");
        this.setAttribute("role", "region");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        this.setAttribute("aria-live", "polite");
    }
}
