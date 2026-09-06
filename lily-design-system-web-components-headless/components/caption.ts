// Caption component
//
// A native <caption>, meant to be used as a child inside one of this
// catalog's table-rooted components (Table, DataTable, CalendarTable,
// GanttTable, KanbanTable). Standalone it behaves like any other
// wrap-a-real-element component: the consumer's light-DOM children are
// moved into the generated <caption>.
//
// Attributes: none beyond the base class + rest-props.
//
// References:
//   - components/caption/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set<string>([]);

export class Caption extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > caption.caption")) return;

        const caption = document.createElement("caption");
        caption.className = rootClassName(this, "caption");
        passThroughAttributes(this, caption, HANDLED);

        moveChildrenInto(this, caption);
        this.appendChild(caption);
    }
}
