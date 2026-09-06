// TourList component
//
// A guided-walkthrough overlay: an <ol role="dialog"> of TourListItem
// steps, shown/hidden via its own `active` attribute (bindable —
// `el.toggleAttribute("active")` works both ways, matching Dialog's `open`
// idiom in this catalog). Stateless about which step is current; the
// consumer drives that via its TourListItem children.
//
// Attributes:
//   label — REQUIRED. Accessible name for the tour dialog, via aria-label.
//   active — presence-based boolean; bindable. Absent by default (the tour
//     starts hidden).
//   ...rest — spread onto the <ol>.
//
// Keyboard: Escape closes (removes the `active` attribute) and fires a
// bubbling, composed "lily-close" CustomEvent — matching Dialog's contract.
//
// References:
//   - components/tour-list/index.md (canonical contract)
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "active"]);

export class TourList extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "active"];
    }

    #ol: HTMLOListElement | null = null;

    connectedCallback(): void {
        if (this.#ol) return;

        const ol = document.createElement("ol");
        ol.className = rootClassName(this, "tour-list");
        ol.setAttribute("role", "dialog");
        ol.setAttribute("aria-modal", "true");
        ol.tabIndex = -1;
        passThroughAttributes(this, ol, HANDLED);
        ol.addEventListener("keydown", this.#onKeydown);

        moveChildrenInto(this, ol);
        this.appendChild(ol);
        this.#ol = ol;
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const ol = this.#ol;
        if (!ol) return;
        const label = this.getAttribute("label");
        if (label !== null) ol.setAttribute("aria-label", label);
        ol.hidden = !this.hasAttribute("active");
    }

    #onKeydown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        this.removeAttribute("active");
        this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
    };
}
