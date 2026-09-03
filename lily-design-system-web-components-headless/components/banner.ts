// Banner component
//
// A dismissible <div role="region" aria-live="polite"> landmark. The
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// Attributes:
//   type — "info" | "success" | "warning" | "error", default "info".
//     Exposed as data-type.
//   dismissible — presence-based boolean; renders a dismiss button.
//   close-label — accessible name for the dismiss button, via aria-label.
//
// Fires a bubbling, composed "lily-close" CustomEvent when dismissed, then
// sets the `hidden` attribute.
//
// References:
//   - components/banner/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class Banner extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "banner");
        this.setAttribute("role", "region");
        this.setAttribute("aria-live", "polite");
        this.setAttribute("data-type", this.getAttribute("type") ?? "info");

        if (this.hasAttribute("dismissible")) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "banner-dismiss";
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
