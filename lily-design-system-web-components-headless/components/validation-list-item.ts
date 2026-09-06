// ValidationListItem component — "upgrade in place" (see
// breadcrumb-list-item.ts for the full rationale). A <ul> may only contain
// <li> children, so this component builds the real <li>, moves the host's
// attributes/children into it, then replaces itself.
//
// Attributes:
//   status — "pending" | "passed" | "failed", default "pending". Rendered
//     as data-status.
//   label — optional; sets aria-label (overrides the accessible name
//     computed from the rule text).
//   ...rest — spread onto the <li>.
//
// References:
//   - components/validation-list-item/index.md (canonical contract)
//   - US Web Design System Validation: https://designsystem.digital.gov/components/validation/
//   - WCAG 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["status", "label"]);

export class ValidationListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;

        const li = document.createElement("li");
        li.className = rootClassName(this, "validation-list-item");
        li.setAttribute("data-status", this.getAttribute("status") ?? "pending");
        const label = this.getAttribute("label");
        if (label !== null) li.setAttribute("aria-label", label);
        passThroughAttributes(this, li, HANDLED);

        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}
