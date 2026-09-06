// BeachBall component
//
// A decorative animated loading indicator. A plain <div role="status"
// aria-live="polite"> — the custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName). The inner
// `<span aria-hidden="true">` is only rendered when active; consumers
// target it for spinning/animation CSS.
//
// Attributes:
//   label — REQUIRED. Accessible description of what is loading, via
//     aria-label.
//   active — "true" | "false", default true (absent = true), matching
//     Dialog's `modal` attribute shape.
//
// References:
//   - components/beach-ball/index.md (canonical contract)
//   - WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status

import { applySelfClassName } from "../lib/dom-utils.js";

export class BeachBall extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["active", "label"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "beach-ball");
            this.setAttribute("role", "status");
            this.setAttribute("aria-live", "polite");
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        const active = this.getAttribute("active") !== "false";
        this.setAttribute("aria-busy", active ? "true" : "false");
        this.setAttribute("data-active", active ? "true" : "false");

        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);

        let spinner = this.querySelector<HTMLSpanElement>(":scope > span[aria-hidden='true']");
        if (active && !spinner) {
            spinner = document.createElement("span");
            spinner.setAttribute("aria-hidden", "true");
            this.appendChild(spinner);
        } else if (!active && spinner) {
            spinner.remove();
        }
    }
}
