// CalendarMonthTable component
//
// A calendar grid for a grid of the days of one month: week rows by seven day columns. A structural wrapper like CalendarTable:
// a <table> with role="grid" and data-view="month"; the consumer supplies the
// head, body and rows by reusing the CalendarTable* sub-elements.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name describing the period shown (e.g. "January 2025").
//   caption — string, optional. Visible caption text displayed above the table.
//   children — ReactNode, required. CalendarTableHead, CalendarTableBody, CalendarTableFoot elements.
//   ...restProps — additional HTML attributes spread onto the <table>.
//
// Syntax:
//   <CalendarMonthTable label="January 2025">
//     <CalendarTableBody>...</CalendarTableBody>
//   </CalendarMonthTable>
//
// Keyboard:
//   Arrows, Home, End, Ctrl+Home, Ctrl+End, PageUp, PageDown, Enter, F2 and Escape over the cells, with one tab stop; data-consumer-keys on the root turns them off.
//
// Accessibility:
//   - role="grid" identifies the table as an interactive grid widget
//   - aria-label provides an accessible name describing the period
//   - data-view="month" lets consumer CSS and JS key on the view
//
// Internationalization:
//   - label and caption supply all text; locale formatting (Intl) and cell
//     content are the consumer's concern
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Reuse the CalendarTable* sub-elements; there are no CalendarMonthTable* sub-elements
//
// References:
//   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

import React, { useEffect, useRef } from "react";
import { warnMissingName } from "./dev-warning";
import { attachGrid } from "./widget-keys";

export interface CalendarMonthTableProps {
    className?: string;
    /** Accessible name describing the period shown. */
    label: string;
    /** Visible caption for the table. */
    caption?: string;
    /** CalendarTableHead, CalendarTableBody, CalendarTableFoot elements. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function CalendarMonthTable({
    className = "",
    label,
    caption = undefined,
    children,
    ...restProps
}: CalendarMonthTableProps) {
    warnMissingName("CalendarMonthTable", label, restProps["aria-labelledby"]);
    const rootRef = useRef<HTMLTableElement>(null);
    useEffect(() => attachGrid(rootRef.current!), []);
    return (
        <table
            ref={rootRef}
            className={`calendar-month-table ${className}`}
            role="grid"
            aria-label={label}
            data-view="month"
            {...restProps}
        >
            {caption && <caption>{caption}</caption>}
            {children}
        </table>
    );
}
