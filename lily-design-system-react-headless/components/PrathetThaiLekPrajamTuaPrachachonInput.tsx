// PrathetThaiLekPrajamTuaPrachachonInput component
//
// A headless input for entering Thailand's National Identification Number (เลขประจำตัวประชาชน).
// Format: Thirteen digits. Digit 1 denotes registration category; digits 2-5 denote the district/province office of registration; digits 6-10 form a serial number; digit 11 is a Modulus-11 check digit computed over the first ten digits; digits 12-13 are further disambiguating digits.
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
//   <PrathetThaiLekPrajamTuaPrachachonInput label="National Identification Number (เลขประจำตัวประชาชน)" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/Thai_identity_card

import React from "react";

export interface PrathetThaiLekPrajamTuaPrachachonInputProps {
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

export default function PrathetThaiLekPrajamTuaPrachachonInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: PrathetThaiLekPrajamTuaPrachachonInputProps) {
    return (
        <input
        className={`prathet-thai-lek-prajam-tua-prachachon-input ${className}`}
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
