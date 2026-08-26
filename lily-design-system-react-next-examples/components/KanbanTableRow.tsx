// KanbanTableRow component
//
// A single row within a KanbanTable grid. Renders as a <tr> containing
// KanbanTableTD cells for each workflow column. Used inside
// KanbanTableHead, KanbanTableBody, or KanbanTableFoot.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. KanbanTableTD cells and header cells.
//   ...restProps — additional HTML attributes spread onto the <tr>.
//
// Syntax:
//   <KanbanTableRow><KanbanTableTD>Task</KanbanTableTD></KanbanTableRow>
//
// Examples:
//   <KanbanTableRow>
//     <KanbanTableTD>Task A</KanbanTableTD>
//     <KanbanTableTD>Task B</KanbanTableTD>
//     <KanbanTableTD>Task C</KanbanTableTD>
//   </KanbanTableRow>
//
// Keyboard:
//   None built-in — keyboard navigation handled at the KanbanTable grid level.
//
// Accessibility:
//   - <tr> has implicit role="row" (no explicit role needed)
//
// Internationalization:
//   - All cell content comes through children prop; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a KanbanTable component
//   - No internal state — purely a structural wrapper
//
// References:
//   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

import React from "react";

export interface KanbanTableRowProps {
    className?: string;
    /** KanbanTableTD cells and header cells for this row. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function KanbanTableRow({
    className = "",
    children,
    ...restProps
}: KanbanTableRowProps) {
    return (
        <tr
        className={`kanban-table-row ${className}`}
        {...restProps}
        >
        {children}
        </tr>
    );
}
