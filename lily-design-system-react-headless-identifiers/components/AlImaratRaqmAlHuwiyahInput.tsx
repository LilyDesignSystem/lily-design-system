// AlImaratRaqmAlHuwiyahInput component
//
// A headless input for entering the United Arab Emirates' Emirates ID number.
// Format: Fifteen digits, written 784-YYYY-NNNNNNN-C: 784 (the country's ISO numeric code), four digits that are usually but not always the year of birth, a seven-digit serial and a check digit. Vendors document a Luhn check over the fifteen digits; the issuer does not publish it, so treat a failure as a warning.
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
//   <AlImaratRaqmAlHuwiyahInput label="Emirates ID number" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/Emirates_ID

import React from "react";
import { warnMissingName } from "./dev-warning";

export interface AlImaratRaqmAlHuwiyahInputProps {
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

export default function AlImaratRaqmAlHuwiyahInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: AlImaratRaqmAlHuwiyahInputProps) {
    warnMissingName(
        "AlImaratRaqmAlHuwiyahInput",
        label,
        restProps["aria-label"],
        restProps["aria-labelledby"],
    );
    return (
        <input
            className={`al-imarat-raqm-al-huwiyah-input ${className}`}
            type="text"
            aria-label={label}
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            required={required}
            disabled={disabled}
            {...restProps}
        />
    );
}
