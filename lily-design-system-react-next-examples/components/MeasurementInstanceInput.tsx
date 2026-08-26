// MeasurementInstanceInput component
//
// A headless text input for entering a specific measurement instance value,
// such as "72 kg", "98.6 F", or "120/80 mmHg". A measurement instance is an
// individual recorded measurement combining a numeric value with its unit.
// The component renders an <input type="text"> with aria-label for accessible
// naming and a bindable value for reactive form integration.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the input via aria-label.
//   value — string, default "". Bindable measurement instance value via controlled.
//   required — boolean, default false. Whether the field is required.
//   disabled — boolean, default false. Whether the field is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <MeasurementInstanceInput label="Weight" value={value} onChange={setValue} />
//
// Examples:
//
//   <MeasurementInstanceInput label="Weight" value={value} onChange={setValue} />
//
//
//   <MeasurementInstanceInput label="Temperature" value={value} onChange={setValue} required />
//
// Keyboard:
//   - Native <input type="text"> keyboard behavior (typing, selection, clipboard-copy-button).
//
// Accessibility:
//   - aria-label provides the accessible name from the label prop
//   - Supports required and disabled HTML states
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Part of the Input/View pattern; pairs with MeasurementInstanceView
//
// References:
//   - HTML input element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text

import React from "react";

export interface MeasurementInstanceInputProps {
    className?: string;
    /** Accessible name for the measurement instance input */
    label: string;
    /** Bindable measurement instance value */
    value?: string;
    /** Whether the input is required */
    required?: boolean;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function MeasurementInstanceInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: MeasurementInstanceInputProps) {
    return (
        <input
        className={`measurement-instance-input ${className}`}
        type="text"
        aria-label={label}
        value={value} onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
