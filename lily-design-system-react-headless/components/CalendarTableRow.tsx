// CalendarTableRow component
//
// A single row within a CalendarTable grid. Renders as a <tr>,
// containing CalendarTableData cells for each day in the week.
// Used inside CalendarTableHead, CalendarTableBody, or CalendarTableFoot.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. CalendarTableData cells for each day in the row.
//   ...restProps — additional HTML attributes spread onto the <tr>.
//
// Syntax:
//   <CalendarTableRow>
//     <CalendarTableData>1</CalendarTableData>
//     <CalendarTableData>2</CalendarTableData>
//   </CalendarTableRow>
//
// Keyboard:
//   None built-in — keyboard navigation is handled at the CalendarTable grid level.
//
// Accessibility:
//   - <tr> has implicit role="row" within the grid (no explicit role needed)
//
// Internationalization:
//   - All cell content comes through children prop; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a CalendarTable component (which provides the <table>)
//   - No internal state — purely a structural wrapper
//
// References:
//   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

import React from "react";

export interface CalendarTableRowProps {
    className?: string;
    /** CalendarTableData cells for this row. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function CalendarTableRow({
    className = "",
    children,
    ...restProps
}: CalendarTableRowProps) {
    return (
        <tr
        className={`calendar-table-row ${className}`}
        {...restProps}
        >
        {children}
        </tr>
    );
}
