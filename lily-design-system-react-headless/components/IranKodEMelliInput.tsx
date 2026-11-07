// IranKodEMelliInput component
//
// A headless input for entering Iran's National Code (Kod-e Melli).
// Format: Ten digits whose last digit is a check digit. The first nine digits are multiplied by 10,9,8,7,6,5,4,3,2 and summed; with r the sum's Modulus-11 remainder, the check digit is r when r is less than 2, otherwise 11 minus r. A number whose ten digits are all the same is never valid.
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
//   <IranKodEMelliInput label="National Code (Kod-e Melli)" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/Iranian_identity_card

import React from "react";
import { warnMissingName } from "./dev-warning";

export interface IranKodEMelliInputProps {
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

export default function IranKodEMelliInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: IranKodEMelliInputProps) {
    warnMissingName(
        "IranKodEMelliInput",
        label,
        restProps["aria-label"],
        restProps["aria-labelledby"],
    );
    return (
        <input
            className={`iran-kod-e-melli-input ${className}`}
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
