// CalendarTableTD component
//
// A single day cell within a CalendarTable grid. Renders as a <td> with
// role="gridcell", supporting selected and today states for visual and
// accessible indication. Uses a roving tabindex pattern where the selected
// cell receives focus. Designed for use inside a CalendarTableRow.
//
// Props:
//   className — string, optional. CSS class name.
//   selected — boolean, default false. Whether this day cell is selected.
//   today — boolean, default false. Whether this day cell represents today's date.
//   children — ReactNode, required. Day content, typically the day number.
//   ...restProps — additional HTML attributes spread onto the <td>.
//
// Syntax:
//   <CalendarTableTD>15</CalendarTableTD>
//
// Examples:
//   
//   <CalendarTableTD selected today>15</CalendarTableTD>
//
//   
//   <CalendarTableTD>22</CalendarTableTD>
//
// Keyboard:
//   - Tab: Focus moves to the selected cell (tabindex="0")
//   - Arrow keys: Typically handled by the parent CalendarTable grid navigation
//
// Accessibility:
//   - role="gridcell" identifies the cell as part of a grid
//   - aria-selected set to true when selected; omitted otherwise
//   - aria-current="date" set when the cell represents today; omitted otherwise
//   - Roving tabindex: tabindex="0" when selected, "-1" otherwise
//
// Internationalization:
//   - Day content comes through children prop; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a CalendarTableRow
//
// References:
//   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

import React from "react";

export interface CalendarTableTDProps {
    className?: string;
    /** Whether this day is selected. */
    selected?: boolean;
    /** Whether this day is today. */
    today?: boolean;
    /** Day content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function CalendarTableTD({
    className = "",
    selected = false,
    today = false,
    children,
    ...restProps
}: CalendarTableTDProps) {
    return (
        <td
        className={`calendar-table-td ${className}`}
        role="gridcell"
        aria-selected={selected || undefined}
        aria-current={today ? "date" : undefined}
        tabIndex={selected ? 0 : -1}
        {...restProps}
        >
        {children}
        </td>
    );
}
