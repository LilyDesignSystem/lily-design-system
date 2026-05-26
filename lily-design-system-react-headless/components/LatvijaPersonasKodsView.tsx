// LatvijaPersonasKodsView component
//
// A headless display component for showing Latvia's
// Personas kods in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <LatvijaPersonasKodsView label="Personal Code" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_number#Latvia

import React from "react";

export interface LatvijaPersonasKodsViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function LatvijaPersonasKodsView({
    className = "",
    label,
    value = "",
    ...restProps
}: LatvijaPersonasKodsViewProps) {
    return (
        <span
        className={`latvija-personas-kods-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
