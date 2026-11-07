// CalendarWeekTable component
//
// A calendar grid for a grid of the seven days of one week as day columns. A structural wrapper like CalendarTable:
// a <table> with role="grid" and data-view="week"; the consumer supplies the
// head, body and rows by reusing the CalendarTable* sub-elements.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name describing the period shown (e.g. "Week of 6 January 2025").
//   caption — string, optional. Visible caption text displayed above the table.
//   children — ReactNode, required. CalendarTableHead, CalendarTableBody, CalendarTableFoot elements.
//   ...restProps — additional HTML attributes spread onto the <table>.
//
// Syntax:
//   <CalendarWeekTable label="Week of 6 January 2025">
//     <CalendarTableBody>...</CalendarTableBody>
//   </CalendarWeekTable>
//
// Keyboard:
//   Arrows, Home, End, Ctrl+Home, Ctrl+End, PageUp, PageDown, Enter, F2 and Escape over the cells, with one tab stop; data-consumer-keys on the root turns them off.
//
// Accessibility:
//   - role="grid" identifies the table as an interactive grid widget
//   - aria-label provides an accessible name describing the period
//   - data-view="week" lets consumer CSS and JS key on the view
//
// Internationalization:
//   - label and caption supply all text; locale formatting (Intl) and cell
//     content are the consumer's concern
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Reuse the CalendarTable* sub-elements; there are no CalendarWeekTable* sub-elements
//
// References:
//   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

import React, { useEffect, useRef } from "react";
import { warnMissingName } from "./dev-warning";
import { attachGrid } from "./widget-keys";

export interface CalendarWeekTableProps {
    className?: string;
    /** Accessible name describing the period shown. */
    label: string;
    /** Visible caption for the table. */
    caption?: string;
    /** CalendarTableHead, CalendarTableBody, CalendarTableFoot elements. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function CalendarWeekTable({
    className = "",
    label,
    caption = undefined,
    children,
    ...restProps
}: CalendarWeekTableProps) {
    warnMissingName("CalendarWeekTable", label, restProps["aria-labelledby"]);
    const rootRef = useRef<HTMLTableElement>(null);
    useEffect(() => attachGrid(rootRef.current!), []);
    return (
        <table
            ref={rootRef}
            className={`calendar-week-table ${className}`}
            role="grid"
            aria-label={label}
            data-view="week"
            {...restProps}
        >
            {caption && <caption>{caption}</caption>}
            {children}
        </table>
    );
}
