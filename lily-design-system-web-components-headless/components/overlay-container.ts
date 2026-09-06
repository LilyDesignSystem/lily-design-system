// OverlayContainer component
//
// A full-viewport overlay backdrop for modals and sheets. The custom
// element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). No visual styling — the consumer
// provides the scrim background, blur, and positioning; the modal child
// carries its own role="dialog"/aria-modal, not this container.
//
// Attributes:
//   open — presence-based boolean; bindable. Drives data-open,
//     aria-hidden, and the native `hidden` attribute.
//   label — optional. Accessible name, via aria-label.
//
// Fires a bubbling, composed "lily-close" CustomEvent when the backdrop
// itself (not a child) is clicked — the web-component equivalent of the
// other frameworks' onclick/onClick backdrop-close callback, since a
// custom element attribute cannot carry a function reference.
//
// References:
//   - components/overlay-container/index.md (canonical contract)
//   - WAI-ARIA dialog pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

import { applySelfClassName } from "../lib/dom-utils.js";

export class OverlayContainer extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label"];
    }

    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "overlay-container");
        this.setAttribute("role", "presentation");
        this.addEventListener("click", this.#onClick);
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        const open = this.hasAttribute("open");
        this.setAttribute("data-open", open ? "true" : "false");
        this.setAttribute("aria-hidden", open ? "false" : "true");
        this.hidden = !open;
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        else this.removeAttribute("aria-label");
    }

    #onClick = (event: MouseEvent): void => {
        if (event.target !== this) return;
        this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
    };
}
