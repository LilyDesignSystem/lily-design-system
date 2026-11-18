// CostaRicaCedulaDeIdentidadInput component
//
// A headless input for entering Costa Rica's Cédula de Identidad.
// Format: A province digit, a volume (tomo) of up to four digits and an entry (asiento) of up to four digits, written P-TTTT-AAAA (1-0613-0584) and often stored as nine or ten digits with the leading zeroes padded. It has no check digit, so only the parts and their lengths can be checked.
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
//   <CostaRicaCedulaDeIdentidadInput label="Cédula de Identidad" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://es.wikipedia.org/wiki/C%C3%A9dula_de_identidad_(Costa_Rica)

import React from "react";
import { warnMissingName } from "./dev-warning";

export interface CostaRicaCedulaDeIdentidadInputProps {
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

export default function CostaRicaCedulaDeIdentidadInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: CostaRicaCedulaDeIdentidadInputProps) {
    warnMissingName(
        "CostaRicaCedulaDeIdentidadInput",
        label,
        restProps["aria-label"],
        restProps["aria-labelledby"],
    );
    return (
        <input
            className={`costa-rica-cedula-de-identidad-input ${className}`}
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
