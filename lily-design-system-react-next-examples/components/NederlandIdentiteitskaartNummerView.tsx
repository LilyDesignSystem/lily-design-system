// NederlandIdentiteitskaartNummerView component
//
// A headless display component for showing Netherlands's
// Identiteitskaart Nummer in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <NederlandIdentiteitskaartNummerView label="Dutch National Identity Card Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Dutch_identity_card

import React from "react";

export interface NederlandIdentiteitskaartNummerViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function NederlandIdentiteitskaartNummerView({
    className = "",
    label,
    value = "",
    ...restProps
}: NederlandIdentiteitskaartNummerViewProps) {
    return (
        <span
        className={`nederland-identiteitskaart-nummer-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
