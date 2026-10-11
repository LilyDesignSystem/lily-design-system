// MexicoClaveUnicaDeRegistroDePoblacionInput component
//
// A headless input for entering Mexico's Clave Única de Registro de Población (CURP).
// Format: Eighteen-character alphanumeric code built from name, date of birth, sex, and state of birth: first letter of the first surname plus its first internal vowel; first letter of the second surname (or X if none); first letter of the given name; six-digit date of birth (YYMMDD); H or M for sex (X for non-binary); a two-letter state code (NE for those born abroad); a consonant from each surname and the given name; then two further disambiguating characters. No trailing check digit.
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
//   <MexicoClaveUnicaDeRegistroDePoblacionInput label="Clave Única de Registro de Población (CURP)" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/Unique_Population_Registry_Code

import React from "react";

export interface MexicoClaveUnicaDeRegistroDePoblacionInputProps {
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

export default function MexicoClaveUnicaDeRegistroDePoblacionInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: MexicoClaveUnicaDeRegistroDePoblacionInputProps) {
    return (
        <input
        className={`mexico-clave-unica-de-registro-de-poblacion-input ${className}`}
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
