// DateField component
//
// A headless date field providing a fully labeled date input with built-in support
// for descriptions and error messages. It wraps a native <input type="date"> with
// a visible <label>, optional helper text, and validation error display, all linked
// via auto-generated IDs for accessibility. Error messages are announced to screen
// readers via role="alert". Ideal for forms requiring date input with validation.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Visible label text for the date field.
//   value — string, default "". Current date value in YYYY-MM-DD format; bindable via value + onChange.
//   description — string, default undefined. Helper text displayed below the input.
//   error — string, default undefined. Error message displayed when validation fails.
//   required — boolean, default false. Whether the field is required.
//   disabled — boolean, default false. Whether the field is disabled.
//   id — string, default undefined. Custom ID for the input element; auto-generated if omitted.
//   ...restProps — additional HTML attributes spread onto the wrapper <div>.
//
// Syntax:
//   <DateField label="Start date" value={value} onChange={setValue} />
//
// Examples:
//
//   <DateField label="End date" value={value} onChange={setValue} error="Required" required />
//
//   <DateField label="Birthday" value={value} onChange={setValue} description="Format: YYYY-MM-DD" />
//
// Keyboard:
//   - None beyond native <input type="date"> keyboard behavior, which varies by browser
//
// Accessibility:
//   - <label htmlFor={inputId}> links the visible label to the input
//   - aria-describedby links the input to its description text when present
//   - aria-invalid="true" indicates the input has an invalid value when error is present
//   - aria-errormessage links the input to its error message when present
//   - role="alert" on the error paragraph announces errors to screen readers
//
// Internationalization:
//   - The label, description, and error props provide all text; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Auto-generates a unique ID if none is provided, using computed for reactivity
//   - IDs are derived for description and error elements for proper ARIA linking
//
// References:
//   - ARIA Error Handling: https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21
//   - WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/

import React, { useId } from "react";

export interface DateFieldProps {
    className?: string;
    /** Visible label for the date field. */
    label: string;
    /** Current date value in YYYY-MM-DD format. Bindable. */
    value?: string;
    /** Helper text displayed below the input. */
    description?: string;
    /** Error message when validation fails. */
    error?: string;
    /** Whether the field is required. */
    required?: boolean;
    /** Whether the field is disabled. */
    disabled?: boolean;
    /** Custom id for the input element. */
    id?: string;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function DateField({
    className = "",
    label,
    value = "",
    description = undefined,
    error = undefined,
    required = false,
    disabled = false,
    id = undefined,
    onChange,
    ...restProps
}: DateFieldProps) {
    const generatedId = `date-field-${useId()}`;
    const inputId = id ?? generatedId;
    const descriptionId = `${inputId}-desc`;
    const errorId = `${inputId}-error`;

    return (
        <div
        className={`date-field ${className}`}
        {...restProps}
        >
        <label htmlFor={inputId}>{label}</label>
        <input
        className="date-input"
        id={inputId}
        type="date"
        value={value} onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        aria-describedby={description ? descriptionId : undefined}
        aria-invalid={error ? true : undefined}
        aria-errormessage={error ? errorId : undefined}
        />
        {description && (<><p id={descriptionId}>{description}</p></>)}
        {error && (<><p
        id={errorId}
        role="alert"
        >
        {error}
        </p></>)}
        </div>
    );
}
