// Popup component
//
// A conditionally-visible <div role="dialog"> general-purpose overlay.
// Same shape as Popover, under a different class name — the canonical
// contract documents both identically apart from intent (Popover:
// anchored contextual content; Popup: confirmations/prompts). The
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — REQUIRED. Accessible name for the popup dialog, via
//     aria-label.
//   open — presence-based boolean; bindable. The host's `hidden`
//     property reflects !open.
//
// Keyboard: none built in — Escape-to-close and focus trapping are
// documented CONSUMER responsibilities.
//
// References:
//   - components/popup/index.md (canonical contract)
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/

import { applySelfClassName } from "../lib/dom-utils.js";

export class Popup extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "popup");
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
