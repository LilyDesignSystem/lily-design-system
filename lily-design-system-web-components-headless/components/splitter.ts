// Splitter component
//
// A draggable divider for resizing adjacent panels. Renders a
// <div role="separator">; the custom element stands in for that div
// directly (see lib/dom-utils.applySelfClassName) since <div> has no
// native behaviour worth preserving as a separate element. Dragging and
// arrow-key resizing are the consumer's responsibility (per the canonical
// contract); this component only owns the static ARIA separator shape and
// keyboard focusability. The consumer updates aria-valuenow directly on
// this element (it IS the ARIA-carrying node) as the user drags.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   orientation — "horizontal" | "vertical", default "vertical".
//
// References:
//   - components/splitter/index.md (canonical contract)
//   - WAI-ARIA Window Splitter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
//   - WAI-ARIA Separator Role: https://www.w3.org/TR/wai-aria-1.2/#separator

import { applySelfClassName } from "../lib/dom-utils.js";

export class Splitter extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "orientation"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "splitter");
            this.setAttribute("role", "separator");
            this.tabIndex = 0;
            this.setAttribute("aria-valuenow", "50");
            this.setAttribute("aria-valuemin", "0");
            this.setAttribute("aria-valuemax", "100");
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
        this.setAttribute("aria-orientation", this.getAttribute("orientation") ?? "vertical");
    }
}
