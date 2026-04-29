// GanttTableTH component
//
// A column header cell within a GanttTable, rendered as a <th> element.
// Used inside a <GanttTableTR> within <GanttTableHead> to label the time
// period columns of the Gantt grid.
//
// Props:
//   className — string, optional. CSS class name.
//   colSpan — number, optional. Number of columns this header cell spans.
//   rowSpan — number, optional. Number of rows this header cell spans.
//   scope — "col" | "row" | "colgroup" | "rowgroup", default "col". Header scope.
//   children — ReactNode, optional. Header cell content.
//   ...restProps — additional HTML attributes spread onto the <th>.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a <tr> within a GanttTable
//
// References:
//   - HTML th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th

import React from "react";

export interface GanttTableTDProps {
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

export default function GanttTableTH({
    className = "",
    colSpan,
    rowSpan,
    scope = "col",
    children,
    ...restProps
}: GanttTableTDProps) {
    return (
        <th
        className={`gantt-table-th ${className}`}
        scope={scope}
        colSpan={colSpan || undefined}
        rowSpan={rowSpan || undefined}
        {...restProps}
        >
        {children}
        </th>
    );
}
