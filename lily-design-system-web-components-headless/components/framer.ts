// Framer component
//
// A container for framed content display (screenshots, artwork,
// embedded content) with a decorative border the consumer styles. The
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — optional. Accessible name for the framed content, via
//     aria-label — set only when the frame carries semantic meaning
//     beyond decoration.
//
// References:
//   - components/framer/index.md (canonical contract)
//   - Reuters Graphics Framer component: https://github.com/reuters-graphics/graphics-components

import { applySelfClassName } from "../lib/dom-utils.js";

export class Framer extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "framer");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
