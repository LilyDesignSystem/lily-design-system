// Drawer component
//
// A panel that slides in from an edge of the viewport: a
// <div role="dialog" aria-modal="true">. The custom element stands in
// for the wrapper div directly (see lib/dom-utils.applySelfClassName).
// Visibility is toggled via the `hidden` content attribute rather than
// truly adding/removing the element — equivalent for both the
// accessibility tree and visual rendering (a hidden element is not
// exposed to assistive technology), matching this catalog's
// EditableForm precedent.
//
// Attributes:
//   open — presence-based boolean; bindable. Controls visibility.
//   label — REQUIRED. Accessible name, via aria-label.
//   side — "left" | "right" | "top" | "bottom", default "left". Which
//     edge the drawer enters from, exposed as data-side for consumer
//     CSS/animation.
//
// Keyboard: Escape closes the drawer (removes the `open` attribute).
//
// References:
//   - components/drawer/index.md (canonical contract)
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

import { applySelfClassName } from "../lib/dom-utils.js";

export class Drawer extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label", "side"];
    }

    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "drawer");
        this.setAttribute("role", "dialog");
        this.setAttribute("aria-modal", "true");
        this.tabIndex = -1;
        this.addEventListener("keydown", this.#onKeydown);

        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        this.setAttribute("data-side", this.getAttribute("side") ?? "left");
        this.hidden = !this.hasAttribute("open");
    }

    #onKeydown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        this.removeAttribute("open");
    };
}
