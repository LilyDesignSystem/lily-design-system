// TextAreaInput component
//
// A headless multi-line text input that wraps the native HTML <textarea>
// element. Used for comments, messages, descriptions, feedback, code input,
// and any scenario where users need to enter extended text content. Unlike
// a single-line TextInput, TextAreaInput provides a larger, scrollable text area
// that supports multiple lines.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Bindable text content; supports value + onChange.
//   rows — number, default undefined. Number of visible text rows.
//   required — boolean, default false. Whether the text-area-input is required.
//   disabled — boolean, default false. Whether the text-area-input is disabled.
//   ...restProps — additional HTML attributes spread onto the <textarea>.
//
// Syntax:
//   <TextAreaInput label="Comments" value={value} onChange={setValue} rows={5} />
//
// Examples:
//
//   <TextAreaInput label="Description" value={description} onChange={setDescription} required />
//
//
//   <TextAreaInput label="Notes" value={value} onChange={setValue} disabled={isReadOnly} />
//
// Keyboard:
//   - Tab: moves focus to and from the text-area-input (native behavior)
//   - Enter: inserts a new line (does not submit forms)
//   - All standard text editing keys function normally
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
//   - Consumer can wrap with their own visible <label> element
//
// References:
//   - MDN text-area-input element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/text-area-input

import React from "react";

export interface TextareaProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Current value. Bindable. */
    value?: string;
    /** Number of visible rows. */
    rows?: number;
    /** Whether required. */
    required?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function TextAreaInput({
    className = "",
    label,
    value = "",
    rows = undefined,
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: TextareaProps) {
    return (
        <textarea
        className={`text-area-input ${className}`}
        aria-label={label}
        value={value} onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
        required={required}
        disabled={disabled}
        {...restProps}
        ></textarea>
    );
}
