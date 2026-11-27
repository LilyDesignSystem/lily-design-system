// WarningCallout component
//
// An <aside role="alert"> for content requiring immediate attention.
// role="alert" implicitly sets an assertive live region, so no explicit
// aria-live is needed.
//
// Attributes:
//   label — optional; the alert content itself usually carries the
//     message, but `label` disambiguates when multiple alerts share a
//     page, via aria-label.
//
// References:
//   - components/warning-callout/index.md (canonical contract)

import {
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
    followLabel,
} from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class WarningCallout extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(): void {
        followLabel(this, "aside.warning-callout", "warning-callout");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > aside.warning-callout")) return;

        const aside = document.createElement("aside");
        aside.className = rootClassName(this, "warning-callout");
        aside.setAttribute("role", "alert");
        const label = this.getAttribute("label");
        if (label !== null) aside.setAttribute("aria-label", label);
        passThroughAttributes(this, aside, HANDLED);

        moveChildrenInto(this, aside);
        this.appendChild(aside);
    }
}
