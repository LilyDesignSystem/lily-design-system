// CheckList component
//
// A semantic list container for CheckListItem components — options, tasks,
// or steps a consumer marks off, typically with a checkbox in each item.
//
// Attributes:
//   label — optional. Accessible name, via aria-label.
//   ...rest — spread onto the <ol>.
//
// References:
//   - components/check-list/index.md (canonical contract)
//   - WAI-ARIA list role: https://www.w3.org/TR/wai-aria-1.2/#list

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class CheckList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > ol.check-list")) return;

        const ol = document.createElement("ol");
        ol.className = rootClassName(this, "check-list");
        ol.setAttribute("role", "list");
        const label = this.getAttribute("label");
        if (label !== null) ol.setAttribute("aria-label", label);
        passThroughAttributes(this, ol, HANDLED);

        moveChildrenInto(this, ol);
        this.appendChild(ol);
    }
}
