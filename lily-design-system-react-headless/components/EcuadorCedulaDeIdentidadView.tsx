// EcuadorCedulaDeIdentidadView component
//
// A headless display component for showing Ecuador's
// Cedula de Identidad Number in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <EcuadorCedulaDeIdentidadView label="Cedula de Identidad Number" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/C%C3%A9dula_de_identidad

import React from "react";

export interface EcuadorCedulaDeIdentidadViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function EcuadorCedulaDeIdentidadView({
    className = "",
    label,
    value = "",
    ...restProps
}: EcuadorCedulaDeIdentidadViewProps) {
    return (
        <span
            className={`ecuador-cedula-de-identidad-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
