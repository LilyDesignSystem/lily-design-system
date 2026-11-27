// SuperBanner component
//
// A <div role="alert" aria-live="assertive"> communicating a high-priority
// state affecting an entire app, experience, process, or system. The
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — optional accessible name, via aria-label.
//   dismissable — presence-based boolean; renders a dismiss button. (Spelled
//     "dismissable" to match this component's own canonical AGENTS.md.)
//
// Fires a bubbling, composed "lily-close" CustomEvent when dismissed, then
// sets the `hidden` attribute.
//
// References:
//   - components/super-banner/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";
import { setOrRemove } from "../lib/live-element.js";

export class SuperBanner extends HTMLElement {
    #built = false;
    #dismiss: HTMLButtonElement | null = null;

    // A change to label, dismissable or class is shown (tasks.md P50-T28): dismissable added later brings the close button.
    static get observedAttributes(): string[] {
        return ["label", "dismissable", "class"];
    }

    attributeChangedCallback(): void {
        if (this.#built) this.#show();
    }

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;
        this.setAttribute("role", "alert");
        this.setAttribute("aria-live", "assertive");
        this.#show();
    }

    #show(): void {
        if (!this.classList.contains("super-banner")) applySelfClassName(this, "super-banner");
        setOrRemove(this, "aria-label", this.getAttribute("label"));
        if (!this.hasAttribute("dismissable")) {
            this.#dismiss?.remove();
            this.#dismiss = null;
            return;
        }
        if (this.#dismiss) return;
        this.#dismiss = document.createElement("button");
        this.#dismiss.type = "button";
        this.#dismiss.className = "super-banner-dismiss";
        this.#dismiss.addEventListener("click", this.#onDismiss);
        this.appendChild(this.#dismiss);
    }

    #onDismiss = (): void => {
        this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
        this.hidden = true;
    };
}
