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

export class SuperBanner extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "super-banner");
        this.setAttribute("role", "alert");
        this.setAttribute("aria-live", "assertive");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);

        if (this.hasAttribute("dismissable")) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "super-banner-dismiss";
            button.addEventListener("click", this.#onDismiss);
            this.appendChild(button);
        }
    }

    #onDismiss = (): void => {
        this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
        this.hidden = true;
    };
}
