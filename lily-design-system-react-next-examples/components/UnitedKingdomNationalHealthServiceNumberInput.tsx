// UnitedKingdomNationalHealthServiceNumberInput component
//
// A headless input for entering a United Kingdom National Health Service (NHS)
// number. The NHS number is a 10-digit identifier assigned to every patient
// registered with the NHS in England, Wales, and the Isle of Man. The standard
// display format is "XXX XXX XXXX" (three groups separated by spaces). The
// component enforces this pattern, uses a numeric keyboard hint for mobile,
// and disables autocomplete to protect sensitive health information.
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
//   <UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" value={value} onChange={setValue} />
//
// Examples:
//   
//   <UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" required />
//
//   
//   <UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" disabled />
//
// Keyboard:
//   - Standard text input keyboard behavior
//   - Users type digits and spaces in the format XXX XXX XXXX
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - inputmode="numeric" hints mobile devices to show a numeric keyboard
//   - pattern enforces XXX XXX XXXX format on form validation
//   - autocomplete="off" protects sensitive health identifiers
//   - required and disabled states are conveyed to assistive technology
//
// Internationalization:
//   - The label prop externalizes user-facing text for translation
//   - No hardcoded strings in the component
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Pattern is defined as a constant for readability
//   - Uses controlled for two-way data binding on value
//
// References:
//   - NHS Number format: https://www.nhs.uk/nhs-services/online-services/find-nhs-number/

import React from "react";

export interface UnitedKingdomNationalHealthServiceNumberInputProps {
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

export default function UnitedKingdomNationalHealthServiceNumberInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: UnitedKingdomNationalHealthServiceNumberInputProps) {
    const nhsPattern = "[0-9]{3} [0-9]{3} [0-9]{4}";

    return (
        <input
        className={`united-kingdom-national-health-service-number-input ${className}`}
        type="text"
        aria-label={label}
        inputMode="numeric"
        pattern={nhsPattern}
        autoComplete="off"
        value={value} onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
