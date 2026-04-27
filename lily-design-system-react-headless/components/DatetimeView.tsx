// DatetimeView component
//
// A headless read-only display of a formatted date and time. Renders a
// semantic <time> element with the machine-readable ISO 8601 value in the
// dateTime attribute. The visible text falls back: children → format → value.
// The component does NOT localize — consumers are responsible for formatting
// the display string in the user's locale and passing it via `format` or
// children.
//
// Props:
//   className — string, optional. CSS class name.
//   value     — string, required. ISO 8601 datetime string (machine-readable).
//   format    — string, optional. Pre-formatted display text.
//   label     — string, optional. aria-label override.
//   children  — ReactNode, optional. Custom display content (overrides format).
//   ...restProps — additional HTML attributes spread onto the <time>.
//
// Syntax:
//   <DatetimeView value="2026-01-15T09:30:00Z" format="Jan 15, 2026, 9:30 AM" />
//
// Examples:
//
//   <DatetimeView value="2026-01-15T09:30:00Z" format="January 15, 2026" />
//
//
//   <DatetimeView value="2026-01-15T09:30:00Z">
//     <strong>Jan 15</strong>, 2026
//   </DatetimeView>
//
// Keyboard: None — read-only display.
//
// Accessibility:
//   - Semantic <time> element with ISO 8601 dateTime attribute
//   - Optional aria-label override via label prop
//
// Internationalization:
//   - Consumer formats the display string for the user's locale
//   - The dateTime attribute always carries the machine-readable ISO value
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - The <time dateTime={value}> attribute uses React camelCase dateTime
//
// References:
//   - HTML <time>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time

import React from "react";

export interface DatetimeViewProps {
    className?: string;
    /** ISO 8601 datetime string (required, machine-readable) */
    value: string;
    /** Pre-formatted display text (consumer formats; component does not localize) */
    format?: string;
    /** aria-label override */
    label?: string;
    /** Optional custom display content (overrides format) */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function DatetimeView({
    className = "",
    value,
    format = undefined,
    label = undefined,
    children = undefined,
    ...restProps
}: DatetimeViewProps) {
    const display: React.ReactNode = children ?? format ?? value;
    return (
        <time
        className={`datetime-view ${className}`}
        dateTime={value}
        aria-label={label}
        {...restProps}
        >
        {display}
        </time>
    );
}
