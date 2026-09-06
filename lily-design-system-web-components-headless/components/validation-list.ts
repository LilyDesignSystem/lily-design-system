// ValidationList component
//
// A live-feedback list of ValidationListItem components — input validation
// rules with pending, passed, and failed states. `aria-live="polite"` so
// status changes on descendants are announced unobtrusively.
//
// Attributes:
//   label — REQUIRED. Accessible name naming the field/list, via aria-label.
//   ...rest — spread onto the <ul>.
//
// References:
//   - components/validation-list/index.md (canonical contract)
//   - US Web Design System Validation: https://designsystem.digital.gov/components/validation/
//   - WAI-ARIA aria-live: https://www.w3.org/TR/wai-aria-1.2/#aria-live

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class ValidationList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > ul.validation-list")) return;

        const ul = document.createElement("ul");
        ul.className = rootClassName(this, "validation-list");
        const label = this.getAttribute("label");
        if (label !== null) ul.setAttribute("aria-label", label);
        ul.setAttribute("aria-live", "polite");
        passThroughAttributes(this, ul, HANDLED);

        moveChildrenInto(this, ul);
        this.appendChild(ul);
    }
}
