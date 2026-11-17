// CalendarTableBody component
//
// The body section of a CalendarTable, rendered as a <tbody> element.
// Contains CalendarTableRow elements with day data cells.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. CalendarTableRow elements with data cells.
//   ...restProps — additional HTML attributes spread onto the <tbody>.
//
// Syntax:
//   <CalendarTableBody>
//     <CalendarTableRow>
//       <CalendarTableTD>1</CalendarTableTD>
//       <CalendarTableTD>2</CalendarTableTD>
//     </CalendarTableRow>
//   </CalendarTableBody>
//
// Keyboard:
//   None built-in — keyboard navigation handled at the CalendarTable grid level.
//
// Accessibility:
//   - <tbody> provides structural body semantics for the table
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a CalendarTable
//   - No internal state — purely a structural wrapper
//
// References:
//   - HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface CalendarTableBodyProps {
    class?: string;
    /** CalendarTableRow elements with day data cells. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function CalendarTableBody(props: CalendarTableBodyProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <tbody
            class={`calendar-table-body ${p.class}`}
            {...restProps}
        >
            {p.children}
        </tbody>
    );
}
