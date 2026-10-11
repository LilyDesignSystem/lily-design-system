// CalendarDayTable component
//
// A calendar grid for a grid of the time slots of one day: one row per slot. A structural wrapper like CalendarTable:
// a <table> with role="grid" and data-view="day"; the consumer supplies the
// head, body and rows by reusing the CalendarTable* sub-elements.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name describing the period shown (e.g. "Monday 6 January 2025").
//   caption — string, optional. Visible caption text displayed above the table.
//   children — ReactNode, required. CalendarTableHead, CalendarTableBody, CalendarTableFoot elements.
//   ...restProps — additional HTML attributes spread onto the <table>.
//
// Syntax:
//   <CalendarDayTable label="Monday 6 January 2025">
//     <CalendarTableBody>...</CalendarTableBody>
//   </CalendarDayTable>
//
// Keyboard:
//   None built-in — consumer implements grid keyboard navigation
//   (arrow keys for cell movement, Enter/Space for selection).
//
// Accessibility:
//   - role="grid" identifies the table as an interactive grid widget
//   - aria-label provides an accessible name describing the period
//   - data-view="day" lets consumer CSS and JS key on the view
//
// Internationalization:
//   - label and caption supply all text; locale formatting (Intl) and cell
//     content are the consumer's concern
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Reuse the CalendarTable* sub-elements; there are no CalendarDayTable* sub-elements
//
// References:
//   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

import React from "react";

export interface CalendarDayTableProps {
    className?: string;
    /** Accessible name describing the period shown. */
    label: string;
    /** Visible caption for the table. */
    caption?: string;
    /** CalendarTableHead, CalendarTableBody, CalendarTableFoot elements. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function CalendarDayTable({
    className = "",
    label,
    caption = undefined,
    children,
    ...restProps
}: CalendarDayTableProps) {
    return (
        <table
            className={`calendar-day-table ${className}`}
            role="grid"
            aria-label={label}
            data-view="day"
            {...restProps}
        >
            {caption && <caption>{caption}</caption>}
            {children}
        </table>
    );
}
