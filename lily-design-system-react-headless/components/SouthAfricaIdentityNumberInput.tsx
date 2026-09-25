// SouthAfricaIdentityNumberInput component
//
// A headless input for entering South Africa's South African Identity Number.
// Format: Thirteen digits in the form YYMMDDSSSSCAZ: the first six encode date of birth; the next four encode sex (0000-4999 female, 5000-9999 male); the eleventh digit encodes citizenship status (0 citizen, 1 permanent resident, 2 refugee); the twelfth is a legacy field fixed at 8 on modern cards; the thirteenth is a Luhn (Modulus-10) check digit over the preceding twelve.
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
//   <SouthAfricaIdentityNumberInput label="South African Identity Number" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/South_African_identity_card

import React from "react";

export interface SouthAfricaIdentityNumberInputProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The current value of the input, bindable */
    value?: string;
    /** Whether the input is required for form submission */
    required?: boolean;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function SouthAfricaIdentityNumberInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: SouthAfricaIdentityNumberInputProps) {
    return (
        <input
        className={`south-africa-identity-number-input ${className}`}
        type="text"
        aria-label={label}
        autoComplete="off"
        value={value} onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
