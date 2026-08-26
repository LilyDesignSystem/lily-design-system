// KanbanTableHead component
//
// The header section of a KanbanTable, rendered as a <thead> element.
// Contains KanbanTableRow elements with column headers for workflow stages.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. KanbanTableRow elements with header cells.
//   ...restProps — additional HTML attributes spread onto the <thead>.
//
// Syntax:
//   <KanbanTableHead>
//     <KanbanTableRow><th>To Do</th><th>In Progress</th><th>Done</th></KanbanTableRow>
//   </KanbanTableHead>
//
// Keyboard:
//   None built-in — keyboard navigation handled at the KanbanTable grid level.
//
// Accessibility:
//   - <thead> provides structural header semantics for the table
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a KanbanTable
//   - No internal state — purely a structural wrapper
//
// References:
//   - HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead

import React from "react";

export interface KanbanTableHeadProps {
    className?: string;
    /** KanbanTableRow elements with header cells. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function KanbanTableHead({
    className = "",
    children,
    ...restProps
}: KanbanTableHeadProps) {
    return (
        <thead
        className={`kanban-table-head ${className}`}
        {...restProps}
        >
        {children}
        </thead>
    );
}
