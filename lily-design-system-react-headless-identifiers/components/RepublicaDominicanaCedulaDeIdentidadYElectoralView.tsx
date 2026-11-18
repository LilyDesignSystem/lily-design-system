// RepublicaDominicanaCedulaDeIdentidadYElectoralView component
//
// A headless display component for showing the Dominican Republic's
// Cédula de Identidad y Electoral in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <RepublicaDominicanaCedulaDeIdentidadYElectoralView label="Cédula de Identidad y Electoral" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://es.wikipedia.org/wiki/Junta_Central_Electoral_(Rep%C3%BAblica_Dominicana)

import React from "react";

export interface RepublicaDominicanaCedulaDeIdentidadYElectoralViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function RepublicaDominicanaCedulaDeIdentidadYElectoralView({
    className = "",
    label,
    value = "",
    ...restProps
}: RepublicaDominicanaCedulaDeIdentidadYElectoralViewProps) {
    return (
        <span
            className={`republica-dominicana-cedula-de-identidad-y-electoral-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
