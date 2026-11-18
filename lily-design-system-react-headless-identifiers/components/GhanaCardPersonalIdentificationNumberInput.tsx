// GhanaCardPersonalIdentificationNumberInput component
//
// A headless input for entering Ghana's Ghana Card PIN.
// Format: A three-letter prefix (GHA for citizens), a hyphen, a run of digits and a hyphen before a final check character (GHA-123456789-1). Sources disagree on the length of the digit run (eight, nine or ten), and the National Identification Authority does not publish the check-character algorithm, so check the prefix and shape, not the checksum.
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
//   <GhanaCardPersonalIdentificationNumberInput label="Ghana Card PIN" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/Ghana_Card

import React from "react";
import { warnMissingName } from "./dev-warning";

export interface GhanaCardPersonalIdentificationNumberInputProps {
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

export default function GhanaCardPersonalIdentificationNumberInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: GhanaCardPersonalIdentificationNumberInputProps) {
    warnMissingName(
        "GhanaCardPersonalIdentificationNumberInput",
        label,
        restProps["aria-label"],
        restProps["aria-labelledby"],
    );
    return (
        <input
            className={`ghana-card-personal-identification-number-input ${className}`}
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
