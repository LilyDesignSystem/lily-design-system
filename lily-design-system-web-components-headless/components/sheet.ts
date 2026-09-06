// Sheet component
//
// A conditionally-visible modal <div role="dialog"> panel that slides
// in from a screen edge. The custom element stands in for the wrapper
// div directly (see lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   open — presence-based boolean; bindable. The host's `hidden`
//     property reflects !open (Coachmark's convention in this catalog).
//   side — "left" | "right" | "top" | "bottom", default "right".
//     Exposed as data-side for CSS targeting.
//
// Keyboard: Escape closes (removes the `open` attribute) and fires a
// bubbling, composed "lily-close" CustomEvent — the canonical contract
// makes this the COMPONENT's own responsibility (unlike Popover/Popup).
// Focus trapping remains a documented consumer responsibility.
//
// References:
//   - components/sheet/index.md (canonical contract)
//   - WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

import { applySelfClassName } from "../lib/dom-utils.js";

export class Sheet extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label", "side"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "sheet");
            this.setAttribute("role", "dialog");
            this.setAttribute("aria-modal", "true");
            this.tabIndex = -1;
            this.addEventListener("keydown", this.#onKeydown);
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
        this.setAttribute("data-side", this.getAttribute("side") ?? "right");
        this.hidden = !this.hasAttribute("open");
    }

    #onKeydown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        this.removeAttribute("open");
        this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
    };
}
