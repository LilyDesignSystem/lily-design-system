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
import { LiveElement, setOrRemove } from "../lib/live-element.js";

// A change to type, dismissible, close-label or class is shown (tasks.md P50-T28): dismissible added later
// brings the close button, and removed takes it away. The message is the consumer's children.
export class Banner extends LiveElement {
    #dismiss: HTMLButtonElement | null = null;

    static get observedAttributes(): string[] {
        return ["type", "dismissible", "close-label", "class"];
    }

    protected update(): void {
        applySelfClassName(this, "banner");
        this.setAttribute("role", "region");
        this.setAttribute("aria-live", "polite");
        this.setAttribute("data-type", this.getAttribute("type") ?? "info");

        if (!this.hasAttribute("dismissible")) {
            this.#dismiss?.remove();
            this.#dismiss = null;
            return;
        }
        if (!this.#dismiss) {
            this.#dismiss = document.createElement("button");
            this.#dismiss.type = "button";
            this.#dismiss.className = "banner-dismiss";
            this.#dismiss.addEventListener("click", this.#onDismiss);
            this.appendChild(this.#dismiss);
        }
        setOrRemove(this.#dismiss, "aria-label", this.getAttribute("close-label"));
    }

    #onDismiss = (): void => {
        this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
        this.hidden = true;
    };
}
