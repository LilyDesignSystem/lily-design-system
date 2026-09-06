// Carousel component
//
// A slideshow for cycling through content items. A plain <div role="region"
// aria-roledescription="carousel"> — the custom element stands in for the
// wrapper div directly (see lib/dom-utils.applySelfClassName). No internal
// active-slide state is managed here; consumers manage slide state
// externally, matching every framework port.
//
// Attributes:
//   label — REQUIRED. Accessible name for the carousel region, via
//     aria-label.
//
// References:
//   - components/carousel/index.md (canonical contract)
//   - WAI-ARIA Carousel Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/

import { applySelfClassName } from "../lib/dom-utils.js";

export class Carousel extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "carousel");
            this.setAttribute("role", "region");
            this.setAttribute("aria-roledescription", "carousel");
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
    }
}
