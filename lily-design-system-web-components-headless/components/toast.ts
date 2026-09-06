// Toast component
//
// A brief auto-dismissing notification message. Renders a <div> live
// region; the custom element stands in for that div directly (see
// lib/dom-utils.applySelfClassName) since <div> has no native behaviour
// worth preserving as a separate element. Uses `role="status"` +
// `aria-live="polite"` by default, or `role="alert"` +
// `aria-live="assertive"` when `urgent`.
//
// Attributes:
//   label — optional; aria-label for the toast region.
//   urgent — presence-based boolean. When present, uses role="alert" and
//     aria-live="assertive" instead of role="status" and aria-live="polite".
//
// References:
//   - components/toast/index.md (canonical contract)
//   - WAI-ARIA Alert Role: https://www.w3.org/TR/wai-aria-1.2/#alert
//   - WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status

import { applySelfClassName } from "../lib/dom-utils.js";

export class Toast extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "toast");
        const urgent = this.hasAttribute("urgent");
        this.setAttribute("role", urgent ? "alert" : "status");
        this.setAttribute("aria-live", urgent ? "assertive" : "polite");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
