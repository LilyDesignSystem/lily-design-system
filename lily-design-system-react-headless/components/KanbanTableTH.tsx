// KanbanTableTD component
//
// A column header cell within a KanbanTable, rendered as a <th> element.
// Used inside a <KanbanTableRow> within <KanbanTableHead> to label each
// workflow stage column.
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
//   - Must be used inside a <tr> within a KanbanTable
//
// References:
//   - HTML th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th

import React from "react";

export interface KanbanTableTHProps {
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

export default function KanbanTableTD({
    className = "",
    colSpan,
    rowSpan,
    scope = "col",
    children,
    ...restProps
}: KanbanTableTHProps) {
    return (
        <th
        className={`kanban-table-th ${className}`}
        scope={scope}
        colSpan={colSpan || undefined}
        rowSpan={rowSpan || undefined}
        {...restProps}
        >
        {children}
        </th>
    );
}
