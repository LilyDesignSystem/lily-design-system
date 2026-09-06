// Character component
//
// A single character display element. Renders a <span> wrapper around the
// character content: `role="img"` + `aria-label` for a meaningful
// character, or `role="presentation"` + `aria-hidden="true"` for a
// decorative one.
//
// Attributes:
//   label — accessible description of the character; omitted when
//     decorative.
//   decorative — presence-based boolean, default false. When present,
//     hides the character from assistive technology.
//
// References:
//   - components/character/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "decorative"]);

export class Character extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.character")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "character");
        const decorative = this.hasAttribute("decorative");
        if (decorative) {
            span.setAttribute("role", "presentation");
            span.setAttribute("aria-hidden", "true");
        } else {
            span.setAttribute("role", "img");
            const label = this.getAttribute("label");
            if (label !== null) span.setAttribute("aria-label", label);
        }
        passThroughAttributes(this, span, HANDLED);

        moveChildrenInto(this, span);
        this.appendChild(span);
    }
}
