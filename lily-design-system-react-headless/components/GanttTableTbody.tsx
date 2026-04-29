// GanttTableTbody component
//
// The body section of a GanttTable, rendered as a <tbody> element.
// Contains GanttTableTr elements with task data cells.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. GanttTableTr elements with data cells.
//   ...restProps — additional HTML attributes spread onto the <tbody>.
//
// Syntax:
//   <GanttTableTbody>
//     <GanttTableTr>
//       <GanttTableTd>Design</GanttTableTd>
//       <GanttTableTd>Jan 1</GanttTableTd>
//     </GanttTableTr>
//   </GanttTableTbody>
//
// Keyboard:
//   None built-in — keyboard navigation handled at the GanttTable grid level.
//
// Accessibility:
//   - <tbody> provides structural body semantics for the table
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a GanttTable
//   - No internal state — purely a structural wrapper
//
// References:
//   - HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody

import React from "react";

export interface GanttTableBodyProps {
    className?: string;
    /** GanttTableTr elements with task data cells. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function GanttTableTbody({
    className = "",
    children,
    ...restProps
}: GanttTableBodyProps) {
    return (
        <tbody
        className={`gantt-table-tbody ${className}`}
        {...restProps}
        >
        {children}
        </tbody>
    );
}
