// TimePickerInput component
//
// A headless time picker that wraps a native <input type="time"> element,
// allowing users to select a specific time of day. Often used alongside date
// pickers in forms, scheduling tools, or booking systems. The native input
// handles 12-hour/24-hour format based on the browser locale. Supports
// two-way data binding and standard form validation attributes.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Current time value in HH:MM format; bindable with value + onChange.
//   required — boolean, default false. Whether a value is required for form submission.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <TimePickerInput label="Appointment time" value={value} onChange={setValue} />
//
// Examples:
//
//   <TimePickerInput label="Departure time" value={value} onChange={setValue} required />
//
// Keyboard:
//   - Tab: move focus to/from the time input
//   - ArrowUp/ArrowDown: increment/decrement the focused time segment
//   - ArrowLeft/ArrowRight: move between time segments
//
// Accessibility:
//   - aria-label={label} provides an accessible name for the time input
//
// Internationalization:
//   - The label prop accepts any translated string
//   - Time format is locale-dependent via native browser behavior
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Uses controlled for two-way data binding on value
//
// References:
//   - MDN input type="time": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time

import React from "react";

export interface TimePickerInputProps {
    className?: string;
    label: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function TimePickerInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: TimePickerInputProps) {
    return (
        <input
        className={`time-picker-input ${className}`}
        type="time"
        aria-label={label}
        value={value} onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
