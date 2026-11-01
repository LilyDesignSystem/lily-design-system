// ColombiaCedulaDeCiudadaniaView component
//
// A headless display component for showing Colombia's
// Cedula de Ciudadania Number in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <ColombiaCedulaDeCiudadaniaView label="Cedula de Ciudadania Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Colombian_identity_card

import React from "react";

export interface ColombiaCedulaDeCiudadaniaViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function ColombiaCedulaDeCiudadaniaView({
    className = "",
    label,
    value = "",
    ...restProps
}: ColombiaCedulaDeCiudadaniaViewProps) {
    return (
        <span
            className={`colombia-cedula-de-ciudadania-view ${className}`}
            aria-label={label}
            {...restProps}
        >
            {value}
        </span>
    );
}
