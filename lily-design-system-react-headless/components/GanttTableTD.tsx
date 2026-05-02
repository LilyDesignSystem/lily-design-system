// GanttTableTD component
//
// A single cell within a GanttTableTR representing a time period in the
// Gantt table grid. Renders as a <td> with role="gridcell". Supports an
// active state to indicate the task spans this time period, communicated
// via aria-selected for screen readers.
//
// Props:
//   className — string, optional. CSS class name.
//   active — boolean, default false. Whether this cell represents an active time period for the task.
//   children — ReactNode, optional. Cell content such as bar indicators or duration text.
//   ...restProps — additional HTML attributes spread onto the <td>.
//
// Syntax:
//   <GanttTableTD active>---</GanttTableTD>
//   <GanttTableTD />
//
// Examples:
//   
//   <GanttTableTD active>---</GanttTableTD>
//
//   
//   <GanttTableTD />
//
//   
//   <GanttTableTD active>◆</GanttTableTD>
//
// Keyboard:
//   None built-in — keyboard navigation is handled at the GanttTable grid level.
//
// Accessibility:
//   - role="gridcell" identifies the cell as part of a grid
//   - aria-selected set to true when active; omitted otherwise
//   - Roving tabindex: tabindex="0" when active, "-1" otherwise
//
// Internationalization:
//   - Cell content comes through children prop; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a GanttTableTR (which provides the <tr>)
//   - Children are optional — empty cells represent inactive time periods
//
// References:
//   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

import React from "react";

export interface GanttTableTdProps {
    className?: string;
    /** Whether this cell represents an active time period for the task. */
    active?: boolean;
    /** Cell content such as bar indicators or duration text. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function GanttTableTD({
    className = "",
    active = false,
    children,
    ...restProps
}: GanttTableTdProps) {
    return (
        <td
        className={`gantt-table-td ${className}`}
        role="gridcell"
        aria-selected={active || undefined}
        tabIndex={active ? 0 : -1}
        {...restProps}
        >
        {children && (<>{children}</>)}
        </td>
    );
}
