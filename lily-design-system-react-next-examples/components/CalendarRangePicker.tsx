// CalendarRangePicker component
//
// A headless container for calendar-based date range selection. Renders a <div>
// with role="application" to support rich keyboard interactions beyond standard
// navigation. Used in booking systems, travel planners, analytics dashboards,
// and reporting tools where users define start and end dates.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name describing the picker purpose.
//   children — ReactNode, required. Calendar grid content including date cells and navigation controls.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <CalendarRangePicker label="Select dates">
//     
//   </CalendarRangePicker>
//
// Examples:
//   
//   <CalendarRangePicker label="Select travel dates">
//     <CalendarTable label="January 2025">
//       
//     </CalendarTable>
//   </CalendarRangePicker>
//
// Keyboard:
//   None built-in — the consumer should implement date cell navigation (arrow keys),
//   selection (Enter/Space), and range extension (Shift+click) as appropriate.
//
// Accessibility:
//   - role="application" indicates the widget manages its own keyboard interactions
//   - aria-label provides an accessible name for the calendar range picker
//
// Internationalization:
//   - Label text comes through the label prop; no hardcoded strings
//   - All date content and navigation is provided by the consumer
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Consumer provides all selection logic, range highlighting, and navigation
//   - role="application" overrides standard screen reader navigation
//
// References:
//   - WAI-ARIA Application Role: https://www.w3.org/TR/wai-aria-1.2/#application
//   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

import React from "react";

export interface CalendarRangePickerProps {
    className?: string;
    label: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function CalendarRangePicker({
    className = "",
    label,
    children,
    ...restProps
}: CalendarRangePickerProps) {
    return (
        <div
        className={`calendar-range-picker ${className}`}
        role="application"
        aria-label={label}
        {...restProps}
        >
        {children}
        </div>
    );
}
