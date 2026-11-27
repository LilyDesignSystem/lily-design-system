// InformationCallout component
//
// An <aside role="note"> for supplementary information.
//
// Attributes:
//   label — REQUIRED. Accessible name describing the callout, via
//     aria-label (e.g. "Note", "Tip").
//
// References:
//   - components/information-callout/index.md (canonical contract)

import {
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
    followLabel,
} from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class InformationCallout extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(): void {
        followLabel(this, "aside.information-callout", "information-callout");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > aside.information-callout")) return;

        const aside = document.createElement("aside");
        aside.className = rootClassName(this, "information-callout");
        aside.setAttribute("role", "note");
        const label = this.getAttribute("label");
        if (label !== null) aside.setAttribute("aria-label", label);
        passThroughAttributes(this, aside, HANDLED);

        moveChildrenInto(this, aside);
        this.appendChild(aside);
    }
}
