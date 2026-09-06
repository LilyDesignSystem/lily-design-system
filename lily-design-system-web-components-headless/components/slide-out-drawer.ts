// SlideOutDrawer component
//
// A conditionally-visible modal <div role="dialog"> that slides out
// from the side of the page. Same shape as Sheet, minus the `side` /
// data-side attribute (not part of this component's own canonical
// contract). The custom element stands in for the wrapper div directly
// (see lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — REQUIRED. Accessible name for the dialog, via aria-label.
//   open — presence-based boolean; bindable. The host's `hidden`
//     property reflects !open (Coachmark's convention in this catalog).
//
// Keyboard: Escape closes (removes the `open` attribute) and fires a
// bubbling, composed "lily-close" CustomEvent.
//
// References:
//   - components/slide-out-drawer/index.md (canonical contract)
//   - WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

import { applySelfClassName } from "../lib/dom-utils.js";

export class SlideOutDrawer extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "slide-out-drawer");
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
        this.hidden = !this.hasAttribute("open");
    }

    #onKeydown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        this.removeAttribute("open");
        this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
    };
}
