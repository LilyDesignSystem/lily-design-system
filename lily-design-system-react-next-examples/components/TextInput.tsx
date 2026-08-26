// TextInput component
//
// A headless single-line text input that wraps the native HTML <input type="text">
// element. Used for entering short text values such as names, titles, or other
// brief textual data. The component supports accessible labeling via aria-label
// and two-way data binding through a bindable value prop.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Bindable text value; supports value + onChange.
//   required — boolean, default false. Whether the field is required.
//   disabled — boolean, default false. Whether the field is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <TextInput label="Full name" value={value} onChange={setValue} />
//
// Examples:
//
//   <TextInput label="Email" value={email} onChange={setEmail} required />
//
//
//   <TextInput label="Notes" value={notes} onChange={setNotes} disabled />
//
// Keyboard:
//   - None beyond native input behavior -- standard text editing keys
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
//   - Consumer can add placeholder, maxlength, pattern via restProps
//
// References:
//   - MDN input type="text": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text

import React from "react";

export interface TextInputProps {
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

export default function TextInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: TextInputProps) {
    return (
        <input
        className={`text-input ${className}`}
        type="text"
        aria-label={label}
        value={value} onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
