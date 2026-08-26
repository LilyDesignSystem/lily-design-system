// DateRange component
//
// A headless date range providing paired start and end date inputs within a
// semantic <fieldset>. It allows users to specify a span of time using two native
// <input type="date"> elements, each with its own accessible label. Both values
// support two-way binding for reactive state management. Commonly used in booking
// forms, search filters, reporting interfaces, and scheduling tools.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible group label applied to the fieldset via aria-label.
//   startLabel — string, required. Accessible label for the start date input.
//   endLabel — string, required. Accessible label for the end date input.
//   start — string, default "". Start date value in YYYY-MM-DD format; bindable.
//   end — string, default "". End date value in YYYY-MM-DD format; bindable.
//   ...restProps — additional HTML attributes spread onto the <fieldset>.
//
// Syntax:
//   <DateRange label="Trip dates" startLabel="Departure" endLabel="Return" start={start} onStartChange={setStart} end={end} onEndChange={setEnd} />
//
// Examples:
//
//   <DateRange
//     label="Project timeline"
//     startLabel="Start date"
//     endLabel="End date"
//     start={start}
//     onStartChange={setStart}
//     end={end}
//     onEndChange={setEnd}
//   />
//
// Keyboard:
//   - Tab: Move focus between the start and end date inputs
//   - Arrow keys: Navigate within date picker fields (native browser behavior)
//
// Accessibility:
//   - aria-label on <fieldset> provides an accessible group name for the date range pair
//   - aria-label on each input provides individual accessible names
//
// Internationalization:
//   - The label, startLabel, and endLabel props provide all text; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Both start and end use controlled for two-way binding
//   - Uses <fieldset> to semantically group the paired date inputs
//
// References:
//   - MDN input type="date": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
//   - MDN fieldset element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset

import React from "react";

export interface DateRangeProps {
    className?: string;
    /** Accessible group label. */
    label: string;
    /** Start date label. */
    startLabel: string;
    /** End date label. */
    endLabel: string;
    /** Start date value. Bindable. */
    start?: string;
    /** End date value. Bindable. */
    end?: string;
    /** Callback when start changes. */
    onStartChange?: (value: string) => void;
    /** Callback when end changes. */
    onEndChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function DateRange({
    className = "",
    label,
    startLabel,
    endLabel,
    start = "",
    end = "",
    onStartChange,
    onEndChange,
    ...restProps
}: DateRangeProps) {
    return (
        <fieldset
            className={`date-range ${className}`}
            aria-label={label}
            {...restProps}
        >
            <input
                className="date-input"
                type="date"
                aria-label={startLabel}
                value={start}
                onChange={(e) => onStartChange?.(e.target.value)}
            />
            <input
                className="date-input"
                type="date"
                aria-label={endLabel}
                value={end}
                onChange={(e) => onEndChange?.(e.target.value)}
            />
        </fieldset>
    );
}
