// OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput component
//
// A headless input for entering Uzbekistan's Personal identification number (JShShIR / PINFL).
// Format: Fourteen digits in five groups (Cabinet of Ministers Resolution No. 177 of 2022): a first digit from 1 to 6 for sex and century of birth, then groups for the date of birth and the issuing district, a three-digit sequence and a final check digit. The check-digit formula is not published, so check the length, the digits and the first digit's range.
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
//   <OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput label="Personal identification number (JShShIR / PINFL)" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://kun.uz/en/news/2026/01/26/how-to-find-your-pinfl

import React from "react";
import { warnMissingName } from "./dev-warning";

export interface OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInputProps {
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

export default function OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInputProps) {
    warnMissingName(
        "OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput",
        label,
        restProps["aria-label"],
        restProps["aria-labelledby"],
    );
    return (
        <input
            className={`ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input ${className}`}
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
