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
import { setOrRemove } from "../lib/live-element.js";

export class AnnouncementBanner extends HTMLElement {
    #built = false;
    #dismiss: HTMLButtonElement | null = null;

    // A change to label, live, dismissible, dismiss-label or class is shown (tasks.md P50-T28): the dismiss button comes and goes
    // with dismissible.
    static get observedAttributes(): string[] {
        return ["label", "live", "dismissible", "dismiss-label", "class"];
    }

    attributeChangedCallback(): void {
        if (this.#built) this.#apply();
    }

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;
        this.setAttribute("role", "region");
        this.#apply();
    }

    #apply(): void {
        if (!this.classList.contains("announcement-banner"))
            applySelfClassName(this, "announcement-banner");
        setOrRemove(this, "aria-label", this.getAttribute("label"));
        setOrRemove(this, "aria-live", this.hasAttribute("live") ? "polite" : null);

        if (!this.hasAttribute("dismissible")) {
            this.#dismiss?.remove();
            this.#dismiss = null;
            return;
        }
        if (!this.#dismiss) {
            this.#dismiss = document.createElement("button");
            this.#dismiss.type = "button";
            this.#dismiss.className = "announcement-banner-dismiss";
            this.#dismiss.addEventListener("click", this.#onDismiss);
            this.appendChild(this.#dismiss);
        }
        setOrRemove(this.#dismiss, "aria-label", this.getAttribute("dismiss-label"));
    }

    #onDismiss = (): void => {
        this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
        this.hidden = true;
    };
}
