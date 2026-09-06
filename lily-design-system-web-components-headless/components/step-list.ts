// StepList component
//
// An ordered list of StepListItem components showing progress through a
// multi-step process.
//
// Attributes:
//   label — optional. Accessible name, via aria-label.
//   current — optional, 0-based index. A data hook for the active step,
//     exposed as data-current for consumer styling — not itself an ARIA
//     attribute (aria-current="step" belongs to the individual item).
//   ...rest — spread onto the <ol>.
//
// References:
//   - components/step-list/index.md (canonical contract)
//   - Ant Design Steps: https://ant.design/components/steps

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "current"]);

export class StepList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > ol.step-list")) return;

        const ol = document.createElement("ol");
        ol.className = rootClassName(this, "step-list");
        const label = this.getAttribute("label");
        if (label !== null) ol.setAttribute("aria-label", label);
        const current = this.getAttribute("current");
        if (current !== null) ol.setAttribute("data-current", current);
        passThroughAttributes(this, ol, HANDLED);

        moveChildrenInto(this, ol);
        this.appendChild(ol);
    }
}
