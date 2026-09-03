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

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class WarningCallout extends HTMLElement {
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
