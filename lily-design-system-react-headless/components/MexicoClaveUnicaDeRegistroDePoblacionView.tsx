// MexicoClaveUnicaDeRegistroDePoblacionView component
//
// A headless display component for showing Mexico's
// Clave Única de Registro de Población (CURP) in a read-only format.
// Format: Eighteen-character alphanumeric code built from name, date of birth, sex, and state of birth: first letter of the first surname plus its first internal vowel; first letter of the second surname (or X if none); first letter of the given name; six-digit date of birth (YYMMDD); H or M for sex (X for non-binary); a two-letter state code (NE for those born abroad); a consonant from each surname and the given name; then two further disambiguating characters. No trailing check digit.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <MexicoClaveUnicaDeRegistroDePoblacionView label="Clave Única de Registro de Población (CURP)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Unique_Population_Registry_Code

import React from "react";

export interface MexicoClaveUnicaDeRegistroDePoblacionViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function MexicoClaveUnicaDeRegistroDePoblacionView({
    className = "",
    label,
    value = "",
    ...restProps
}: MexicoClaveUnicaDeRegistroDePoblacionViewProps) {
    return (
        <span
        className={`mexico-clave-unica-de-registro-de-poblacion-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
