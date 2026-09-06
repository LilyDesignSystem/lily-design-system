// MedicalBanner component
//
// A <div role="region" aria-live="polite"> for medical information across
// the top of a page. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — REQUIRED. Accessible name for the banner, via aria-label.
//   type — "info" | "success" | "warning" | "error", default "info".
//     Exposed as data-type.
//   dismissible — presence-based boolean; renders a dismiss button.
//   close-label — accessible name for the dismiss button, via aria-label.
//
// Always carries data-context="medical" to distinguish it from the plain
// Banner. Fires a bubbling, composed "lily-close" CustomEvent when
// dismissed, then sets the `hidden` attribute.
//
// References:
//   - components/medical-banner/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class MedicalBanner extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "medical-banner");
        this.setAttribute("role", "region");
        this.setAttribute("aria-live", "polite");
        this.setAttribute("data-context", "medical");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        this.setAttribute("data-type", this.getAttribute("type") ?? "info");

        if (this.hasAttribute("dismissible")) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "medical-banner-dismiss";
            const closeLabel = this.getAttribute("close-label");
            if (closeLabel !== null) button.setAttribute("aria-label", closeLabel);
            button.addEventListener("click", this.#onDismiss);
            this.appendChild(button);
        }
    }

    #onDismiss = (): void => {
        this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
        this.hidden = true;
    };
}
