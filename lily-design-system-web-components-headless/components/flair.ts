// Flair component
//
// A <span> for a small inline decorative highlight or emphasis (a
// forum/dashboard "New", "Featured", or role tag). Decorative by
// default (aria-hidden); becomes meaningful once a `label` is supplied.
//
// Attributes:
//   label — optional. When present, sets aria-label (meaningful flair,
//     announced by assistive technology) and omits aria-hidden. When
//     absent, sets aria-hidden="true" (decorative, skipped by AT).
//   ...rest — spread onto the <span>.
//
// References:
//   - components/flair/index.md (canonical contract)
//   - MDN span element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Flair extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const span = this.querySelector(":scope > span.flair");
        if (!span) return;
        span.className = rootClassName(this, "flair");
        // Named, it is an image; unnamed, it is decoration and hidden.
        const label = this.getAttribute("label");
        if (label !== null) {
            span.setAttribute("aria-label", label);
            span.setAttribute("role", "img");
            span.removeAttribute("aria-hidden");
        } else {
            span.removeAttribute("aria-label");
            span.removeAttribute("role");
            span.setAttribute("aria-hidden", "true");
        }
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > span.flair")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "flair");
        const label = this.getAttribute("label");
        if (label !== null) {
            span.setAttribute("aria-label", label);
            span.setAttribute("role", "img");
        } else span.setAttribute("aria-hidden", "true");
        passThroughAttributes(this, span, HANDLED);

        moveChildrenInto(this, span);
        this.appendChild(span);
    }
}
