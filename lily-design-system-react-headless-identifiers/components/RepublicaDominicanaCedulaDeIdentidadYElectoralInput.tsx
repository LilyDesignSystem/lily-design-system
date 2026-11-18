// RepublicaDominicanaCedulaDeIdentidadYElectoralInput component
//
// A headless input for entering the Dominican Republic's Cédula de Identidad y Electoral.
// Format: Eleven digits, usually written 3-7-1 (001-1391820-5): a three-digit issuing office, a seven-digit sequence and a check digit computed with the Luhn algorithm over all eleven digits. A few early numbers fail the check and are still valid, so treat a Luhn failure as a warning, not a rejection.
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
//   <RepublicaDominicanaCedulaDeIdentidadYElectoralInput label="Cédula de Identidad y Electoral" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://es.wikipedia.org/wiki/Junta_Central_Electoral_(Rep%C3%BAblica_Dominicana)

import React from "react";
import { warnMissingName } from "./dev-warning";

export interface RepublicaDominicanaCedulaDeIdentidadYElectoralInputProps {
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

export default function RepublicaDominicanaCedulaDeIdentidadYElectoralInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: RepublicaDominicanaCedulaDeIdentidadYElectoralInputProps) {
    warnMissingName(
        "RepublicaDominicanaCedulaDeIdentidadYElectoralInput",
        label,
        restProps["aria-label"],
        restProps["aria-labelledby"],
    );
    return (
        <input
            className={`republica-dominicana-cedula-de-identidad-y-electoral-input ${className}`}
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
