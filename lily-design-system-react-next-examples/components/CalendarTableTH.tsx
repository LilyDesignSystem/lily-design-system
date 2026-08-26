// CalendarTableTH component
//
// A column header cell within a CalendarTable, rendered as a <th> element.
// Used inside a <CalendarTableRow> within <CalendarTableHead> to label the
// columns of the calendar grid (e.g. day-of-week labels).
//
// Props:
//   className — string, optional. CSS class name.
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

import React from "react";

export interface CalendarTableTHProps {
    className?: string;
    /** Number of columns this header cell spans. */
    colSpan?: number;
    /** Number of rows this header cell spans. */
    rowSpan?: number;
    /** Header scope. */
    scope?: "col" | "row" | "colgroup" | "rowgroup";
    /** Header cell content. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function CalendarTableTH({
    className = "",
    colSpan,
    rowSpan,
    scope = "col",
    children,
    ...restProps
}: CalendarTableTHProps) {
    return (
        <th
        className={`calendar-table-th ${className}`}
        scope={scope}
        colSpan={colSpan || undefined}
        rowSpan={rowSpan || undefined}
        {...restProps}
        >
        {children}
        </th>
    );
}
