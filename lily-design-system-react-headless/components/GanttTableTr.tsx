// GanttTableTr component
//
// A single row within a GanttTable grid. Renders as a <tr> containing
// GanttTableTd cells for each time period and task header cells.
// Used inside GanttTableThead, GanttTableTbody, or GanttTableTfoot.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. GanttTableTd cells and header cells for this row.
//   ...restProps — additional HTML attributes spread onto the <tr>.
//
// Syntax:
//   <GanttTableTr>
//     <th>Design</th>
//     <GanttTableTd active>---</GanttTableTd>
//     <GanttTableTd />
//   </GanttTableTr>
//
// Examples:
//   
//   <GanttTableTr>
//     <th>Development</th>
//     <GanttTableTd />
//     <GanttTableTd active>---</GanttTableTd>
//     <GanttTableTd active>---</GanttTableTd>
//   </GanttTableTr>
//
//   
//   <GanttTableTr>
//     <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
//   </GanttTableTr>
//
// Keyboard:
//   None built-in — keyboard navigation is handled at the GanttTable grid level.
//
// Accessibility:
//   - <tr> has implicit role="row" within the grid (no explicit role needed)
//
// Internationalization:
//   - All cell content comes through children prop; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a GanttTable component (which provides the <table>)
//   - No internal state — purely a structural wrapper
//
// References:
//   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

import React from "react";

export interface GanttTableRowProps {
    className?: string;
    /** GanttTableTd cells and header cells for this row. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function GanttTableTr({
    className = "",
    children,
    ...restProps
}: GanttTableRowProps) {
    return (
        <tr
        className={`gantt-table-tr ${className}`}
        {...restProps}
        >
        {children}
        </tr>
    );
}
