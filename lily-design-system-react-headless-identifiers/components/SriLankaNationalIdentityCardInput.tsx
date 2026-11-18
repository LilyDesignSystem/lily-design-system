// SriLankaNationalIdentityCardInput component
//
// A headless input for entering Sri Lanka's National Identity Card (NIC) number.
// Format: Two forms. Before 2016: nine digits and a letter, V or X (742192757V): the two-digit year of birth, the day of the year (with 500 added for women), a serial and a check digit. Since 2016: twelve digits (197419202757): the four-digit year of birth, the same day of the year, a four-digit serial and the check digit. The check-digit algorithm is not published.
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
//   <SriLankaNationalIdentityCardInput label="National Identity Card (NIC) number" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/National_identity_card_(Sri_Lanka)

import React from "react";
import { warnMissingName } from "./dev-warning";

export interface SriLankaNationalIdentityCardInputProps {
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

export default function SriLankaNationalIdentityCardInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: SriLankaNationalIdentityCardInputProps) {
    warnMissingName(
        "SriLankaNationalIdentityCardInput",
        label,
        restProps["aria-label"],
        restProps["aria-labelledby"],
    );
    return (
        <input
            className={`sri-lanka-national-identity-card-input ${className}`}
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
