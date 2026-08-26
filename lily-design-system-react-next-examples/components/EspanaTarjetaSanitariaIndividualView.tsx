// EspanaTarjetaSanitariaIndividualView component
//
// A headless display component for showing a España Tarjeta Sanitaria
// Individual (TSI) / CIP-SNS in a read-only format.
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling

import React from "react";

export interface EspanaTarjetaSanitariaIndividualViewProps {
    className?: string;
    label: string;
    value?: string;
    [key: string]: unknown;
}

export default function EspanaTarjetaSanitariaIndividualView({
    className = "",
    label,
    value = "",
    ...restProps
}: EspanaTarjetaSanitariaIndividualViewProps) {
    return (
        <span
            className={`espana-tarjeta-sanitaria-individual-view ${className}`}
            aria-label={label}
            {...restProps}>{value}</span>
    );
}
