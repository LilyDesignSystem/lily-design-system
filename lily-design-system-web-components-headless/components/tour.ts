// Tour component
//
// A tour guide, such as for sightseeing, or pathways, or demonstrations,
// etc. — the outer container in the Tour/List/ListItem composition
// pattern. Renders a <div>; the custom element stands in for that div
// directly (see lib/dom-utils.applySelfClassName) since <div> has no
// native behaviour worth preserving as a separate element.
//
// Like the Svelte canonical implementation (tasks.md P18-T13), Tour is a
// non-modal role="dialog" with an `active` attribute and Escape-to-close. It
// sets no aria-modal (tasks.md P18-T6): a tour points at parts of the real
// page and often asks the user to try them, so the page must stay usable, and
// nothing here makes it inert. TourList keeps its own `active`/Escape, as in
// Svelte, and its <ol> keeps its list semantics (no role="dialog").
//
// Attributes:
//   label — REQUIRED. Accessible name for the tour, via aria-label.
//   active — boolean. Whether the tour is shown; hidden while absent. Escape
//     inside the tour removes it and dispatches a bubbling `lily-close` event.
//
// References:
//   - components/tour/index.md (canonical contract)
//   - components/tour-list.ts (its own active/Escape, as in Svelte)
//   - WAI-ARIA Practices: https://www.w3.org/WAI/ARIA/apg/

import { applySelfClassName } from "../lib/dom-utils.js";

export class Tour extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "active"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "tour");
            this.setAttribute("role", "dialog");
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
        this.hidden = !this.hasAttribute("active");
    }

    #onKeydown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape" || !this.hasAttribute("active")) return;
        // The inner TourList closes itself on Escape too; closing the tour is what the user asked for either way.
        this.removeAttribute("active");
        this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
    };
}
