// UruguayCedulaDeIdentidadView component
//
// A headless display component for showing Uruguay's
// Cedula de Identidad Number in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <UruguayCedulaDeIdentidadView label="Cedula de Identidad Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/C%C3%A9dula_de_identidad

import React from "react";

export interface UruguayCedulaDeIdentidadViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function UruguayCedulaDeIdentidadView({
    className = "",
    label,
    value = "",
    ...restProps
}: UruguayCedulaDeIdentidadViewProps) {
    return (
        <span
            className={`uruguay-cedula-de-identidad-view ${className}`}
            aria-label={label}
            {...restProps}
        >
            {value}
        </span>
    );
}
