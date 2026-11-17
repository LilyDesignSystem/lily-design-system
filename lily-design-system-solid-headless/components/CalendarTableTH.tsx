// CalendarTableTH component
//
// A column header cell within a CalendarTable, rendered as a <th> element.
// Used inside a <CalendarTableRow> within <CalendarTableHead> to label the
// columns of the calendar grid (e.g. day-of-week labels).
//
// Props:
//   class — string, optional. CSS class name.
//   colSpan — number, optional. Number of columns this header cell spans.
//   rowSpan — number, optional. Number of rows this header cell spans.
//   scope — "col" | "row" | "colgroup" | "rowgroup", default "col". Header scope.
//   children — ReactNode, optional. Header cell content.
//   ...restProps — additional HTML attributes spread onto the <th>.
//
// Syntax:
//   <CalendarTableHead>
//     <CalendarTableRow>
//       <CalendarTableTD>Mon</CalendarTableTD>
//       <CalendarTableTD>Tue</CalendarTableTD>
//     </CalendarTableRow>
//   </CalendarTableHead>
//
// Keyboard:
//   None — <th> is not interactive.
//
// Accessibility:
//   - <th scope="col"> associates the header with its column for assistive tech
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a <tr> within a CalendarTable
//   - All header text is provided by the consumer via children
//
// References:
//   - HTML th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface CalendarTableTHProps {
    class?: string;
    /** Number of columns this header cell spans. */
    colSpan?: number;
    /** Number of rows this header cell spans. */
    rowSpan?: number;
    /** Header scope. */
    scope?: "col" | "row" | "colgroup" | "rowgroup";
    /** Header cell content. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function CalendarTableTH(props: CalendarTableTHProps) {
    const p = withDefaults({ class: "" as const, scope: "col" as const }, props);
    const restProps = omit(p, "class", "colSpan", "rowSpan", "scope", "children");
    return (
        <th
            class={`calendar-table-th ${p.class}`}
            scope={p.scope}
            colspan={p.colSpan || undefined}
            rowspan={p.rowSpan || undefined}
            {...restProps}
        >
            {p.children}
        </th>
    );
}
