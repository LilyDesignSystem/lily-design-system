// Popover component
//
// A conditionally-visible <div role="dialog"> anchored near a
// consumer-supplied trigger element. The custom element stands in for
// the wrapper div directly (see lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — REQUIRED. Accessible name for the popover dialog, via
//     aria-label.
//   open — presence-based boolean; bindable. The host's `hidden`
//     property reflects !open (Coachmark's convention in this catalog)
//     — the closest a build-once custom element gets to the canonical
//     contract's "conditionally rendered; not in the DOM when closed".
//
// Keyboard: none built in. The canonical contract makes Escape-to-close
// and focus trapping a documented CONSUMER responsibility, unlike
// Sheet/SlideOutDrawer where the component itself owns Escape.
//
// References:
//   - components/popover/index.md (canonical contract)
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/

import { applySelfClassName } from "../lib/dom-utils.js";

export class Popover extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "popover");
            this.setAttribute("role", "dialog");
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        this.hidden = !this.hasAttribute("open");
    }
}
