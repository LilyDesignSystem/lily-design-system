// AnnouncementBanner component
//
// A <div role="region"> highlighting important messages for all users. The
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — REQUIRED. Accessible name for the region, via aria-label.
//   live — presence-based boolean; adds aria-live="polite" so dynamic
//     content changes are announced.
//   dismissible — presence-based boolean; renders a dismiss button.
//   dismiss-label — accessible name for the dismiss button, via aria-label.
//
// Fires a bubbling, composed "lily-close" CustomEvent when dismissed, then
// sets the `hidden` attribute.
//
// References:
//   - components/announcement-banner/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class AnnouncementBanner extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "announcement-banner");
        this.setAttribute("role", "region");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        if (this.hasAttribute("live")) this.setAttribute("aria-live", "polite");

        if (this.hasAttribute("dismissible")) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "announcement-banner-dismiss";
            const dismissLabel = this.getAttribute("dismiss-label");
            if (dismissLabel !== null) button.setAttribute("aria-label", dismissLabel);
            button.addEventListener("click", this.#onDismiss);
            this.appendChild(button);
        }
    }

    #onDismiss = (): void => {
        this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
        this.hidden = true;
    };
}
