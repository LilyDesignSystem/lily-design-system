// ArgentinaCodigoUnicoDeIdentificacionLaboralInput component
//
// A headless input for entering Argentina's Código Único de Identificación Laboral (CUIL).
// Format: Displayed as XX-NNNNNNNN-X: a two-digit prefix denoting registration type/sex (historically 20 male, 27 female, though this classification was discontinued in 2012), the eight-digit DNI (national identity document) number, and a Modulus-11 check digit computed over the ten preceding digits.
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
//   <ArgentinaCodigoUnicoDeIdentificacionLaboralInput label="Código Único de Identificación Laboral (CUIL)" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/C%C3%B3digo_%C3%9Anico_de_Identificaci%C3%B3n_Laboral

import React from "react";

export interface ArgentinaCodigoUnicoDeIdentificacionLaboralInputProps {
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

export default function ArgentinaCodigoUnicoDeIdentificacionLaboralInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: ArgentinaCodigoUnicoDeIdentificacionLaboralInputProps) {
    return (
        <input
        className={`argentina-codigo-unico-de-identificacion-laboral-input ${className}`}
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
