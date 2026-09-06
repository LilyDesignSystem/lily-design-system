// StepListItem component — "upgrade in place" (see breadcrumb-list-item.ts
// for the full rationale). An <ol> may only contain <li> children, so this
// component builds the real <li>, moves the host's attributes/children into
// it, then replaces itself.
//
// Attributes:
//   status — "waiting" | "in-progress" | "finished" | "error", default
//     "waiting". Rendered as data-status.
//   current — presence-based boolean; sets aria-current="step".
//   label — optional; sets aria-label (overrides the default accessible
//     name from the contained title text).
//   ...rest — spread onto the <li>.
//
// References:
//   - components/step-list-item/index.md (canonical contract)
//   - WAI-ARIA aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current
//   - Ant Design Steps: https://ant.design/components/steps

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["status", "current", "label"]);

export class StepListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;

        const li = document.createElement("li");
        li.className = rootClassName(this, "step-list-item");
        li.setAttribute("data-status", this.getAttribute("status") ?? "waiting");
        if (this.hasAttribute("current")) li.setAttribute("aria-current", "step");
        const label = this.getAttribute("label");
        if (label !== null) li.setAttribute("aria-label", label);
        passThroughAttributes(this, li, HANDLED);

        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}
