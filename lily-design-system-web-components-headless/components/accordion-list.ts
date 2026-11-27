// AccordionList component
//
// An ordered list of accordion sections within an AccordionNav: an <ol>, so
// screen readers announce how many sections there are and where each one is.
// The host builds the real <ol> and moves its children into it, so the
// consumer writes each section as an <li class="accordion-list-item"> holding
// a <details> (the catalog has no custom element for the item: a host between
// <ol> and <li> would break the list).
//
// Attributes:
//   label — optional. Accessible name for the list, via aria-label. Only
//     rendered when non-empty, matching the other catalogs' `label || undefined`.
//   ...rest — spread onto the <ol>.
//
// References:
//   - components/accordion-list/index.md (canonical contract)
//   - HTML ol element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class AccordionList extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const root = this.querySelector(":scope > ol.accordion-list");
        if (!root) return;
        root.className = rootClassName(this, "accordion-list");
        // An empty label names nothing, as when it is built.
        const label = this.getAttribute("label");
        if (label) root.setAttribute("aria-label", label);
        else root.removeAttribute("aria-label");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > ol.accordion-list")) return;

        const ol = document.createElement("ol");
        ol.className = rootClassName(this, "accordion-list");
        const label = this.getAttribute("label");
        if (label) ol.setAttribute("aria-label", label);
        passThroughAttributes(this, ol, HANDLED);

        moveChildrenInto(this, ol);
        this.appendChild(ol);
    }
}
