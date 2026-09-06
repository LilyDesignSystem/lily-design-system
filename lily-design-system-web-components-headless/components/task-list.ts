// TaskList component
//
// An ordered list of TaskListItem components — to-dos or action items.
// role="list" explicitly marks it as a list so screen readers still
// announce list semantics even if consumer CSS removes native list
// styling.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   ...rest — spread onto the <ol>.
//
// References:
//   - components/task-list/index.md (canonical contract)
//   - WAI-ARIA list role: https://www.w3.org/TR/wai-aria-1.2/#list

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class TaskList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > ol.task-list")) return;

        const ol = document.createElement("ol");
        ol.className = rootClassName(this, "task-list");
        ol.setAttribute("role", "list");
        const label = this.getAttribute("label");
        if (label !== null) ol.setAttribute("aria-label", label);
        passThroughAttributes(this, ol, HANDLED);

        moveChildrenInto(this, ol);
        this.appendChild(ol);
    }
}
