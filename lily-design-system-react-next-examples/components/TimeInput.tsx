// TimeInput component
//
// A headless time input using the native HTML <input type="time"> element.
// Renders a time picker control appropriate to the user's browser and OS,
// allowing users to enter hours and minutes in a localized format. Commonly
// used for scheduling interfaces, appointment forms, event planners, and any
// form requiring time-of-day entry. The value uses HH:MM format (24-hour).
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Bindable time value in HH:MM format; supports value + onChange.
//   required — boolean, default false. Whether the field is required.
//   disabled — boolean, default false. Whether the field is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <TimeInput label="Start time" value={value} onChange={setValue} />
//
// Examples:
//
//   <TimeInput label="Deadline" value={deadline} onChange={setDeadline} min="09:00" max="17:00" />
//
// Keyboard:
//   - Arrow keys: adjust hours/minutes, Tab between segments (native behavior)
//
// Accessibility:
//   - aria-label={label} provides an accessible name since no visible <label> is included
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Uses controlled for two-way data binding on value
//   - Consumer can add min, max, step via restProps
//
// References:
//   - MDN input type="time": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time

import React from "react";

export interface TimeInputProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Current value. Bindable. */
    value?: string;
    /** Whether required. */
    required?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function TimeInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: TimeInputProps) {
    return (
        <input
        className={`time-input ${className}`}
        type="time"
        aria-label={label}
        value={value} onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
