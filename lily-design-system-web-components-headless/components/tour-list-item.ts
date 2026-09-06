// TourListItem component — "upgrade in place" (see breadcrumb-list-item.ts
// for the full rationale). A <ol>/<ul> may only contain <li> children, so
// this component builds the real <li>, moves the host's attributes/children
// into it, then replaces itself.
//
// Since there is no host instance left after upgrade, "current" here means
// the step's INITIAL visibility at render time, not a live-toggling tour —
// a consumer building a dynamic tour needs its own script regardless of
// framework; this headless contract only fixes the per-step markup.
//
// Attributes:
//   label — REQUIRED. Accessible name for this step; combined with
//     step-number/total-steps (when both given) into "label (Step N of M)".
//   current — presence-based boolean, default false. When absent, the step
//     is hidden from layout (`hidden`) and from assistive technology
//     (aria-hidden="true").
//   step-number — optional. 1-based step number.
//   total-steps — optional. Total number of steps in the tour.
//   ...rest — spread onto the <li>.
//
// References:
//   - components/tour-list-item/index.md (canonical contract)
//   - WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
//   - WAI-ARIA aria-roledescription: https://www.w3.org/TR/wai-aria-1.2/#aria-roledescription
//   - WAI-ARIA aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "current", "step-number", "total-steps"]);

export class TourListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;

        const li = document.createElement("li");
        li.className = rootClassName(this, "tour-list-item");
        li.setAttribute("role", "group");
        li.setAttribute("aria-roledescription", "step");

        const label = this.getAttribute("label") ?? "";
        const stepNumber = this.getAttribute("step-number");
        const totalSteps = this.getAttribute("total-steps");
        const fullLabel =
            stepNumber !== null && totalSteps !== null ? `${label} (Step ${stepNumber} of ${totalSteps})` : label;
        li.setAttribute("aria-label", fullLabel);

        const current = this.hasAttribute("current");
        if (current) {
            li.setAttribute("aria-current", "step");
        } else {
            li.setAttribute("aria-hidden", "true");
            li.hidden = true;
        }

        passThroughAttributes(this, li, HANDLED);

        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}
