// CalendarMonthTable component
//
// A native <table role="grid" data-view="month"> for the month view of a calendar:
// week rows x 7 day columns. A structural wrapper like CalendarTable; the consumer supplies the
// head/body/rows/cells as light-DOM children (there are no CalendarMonthTable* sub-elements)
// and owns locale formatting (Intl) and cell content.
//
// Attributes:
//   label — REQUIRED. Accessible name for the period shown, via aria-label.
//   caption — optional. Visible <caption> text.
//
// Deviation from nothing: same limitation as calendar-table. Per the HTML5
// parsing spec, literal thead/tbody/tr/th/td tags inside this custom element
// are dropped by the parser; populate rows/cells by DOM construction
// (createElement/appendChild). See calendar-table.ts for the full explanation.
//
// References:
//   - components/calendar-month-table/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "caption", "role", "data-view"]);

export class CalendarMonthTable extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > table.calendar-month-table")) return;

        const table = document.createElement("table");
        table.className = rootClassName(this, "calendar-month-table");
        table.setAttribute("role", "grid");
        const label = this.getAttribute("label");
        if (label !== null) table.setAttribute("aria-label", label);
        table.setAttribute("data-view", "month");
        passThroughAttributes(this, table, HANDLED);

        const caption = this.getAttribute("caption");
        if (caption) {
            const cap = document.createElement("caption");
            cap.textContent = caption;
            table.appendChild(cap);
        }

        moveChildrenInto(this, table);
        this.appendChild(table);
    }
}
