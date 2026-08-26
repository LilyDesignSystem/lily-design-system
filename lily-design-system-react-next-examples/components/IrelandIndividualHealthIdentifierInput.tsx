// IrelandIndividualHealthIdentifierInput component
//
// A headless input for entering an Ireland Individual Health Identifier (IHI),
// a 10-digit clinical identifier used by the HSE to safely match patients
// with their medical records across different hospitals and GPs.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". Bindable input value; supports value + onChange.
//   required — boolean, default false. Whether the input is required for form submission.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <IrelandIndividualHealthIdentifierInput label="IHI" value={value} onChange={setValue} />
//
// Examples:
//
//   <IrelandIndividualHealthIdentifierInput label="IHI" required />
//
//
//   <IrelandIndividualHealthIdentifierInput label="IHI" disabled />
//
// Keyboard:
//   - Standard text input keyboard behavior
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - inputMode="numeric" hints mobile devices to show numeric keyboard
//   - pattern="[0-9]{10}" validates 10-digit format
//   - autoComplete="off" protects sensitive health identifiers
//   - required and disabled states are conveyed to assistive technology
//
// Internationalization:
//   - The label prop externalizes user-facing text for translation
//   - No hardcoded strings in the component
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Uses controlled for two-way data binding on value
//
// References:
//   - HSE: https://www.hse.ie/

import React from "react";

export interface IrelandIndividualHealthIdentifierInputProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The current value of the input, bindable */
    value?: string;
    /** Whether the input is required for form submission */
    required?: boolean;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Additional HTML attributes */
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function IrelandIndividualHealthIdentifierInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: IrelandIndividualHealthIdentifierInputProps) {
    const ihiPattern = "[0-9]{10}";

    return (
        <input
        className={`ireland-individual-health-identifier-input ${className}`}
        type="text"
        aria-label={label}
        inputMode="numeric"
        pattern={ihiPattern}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
