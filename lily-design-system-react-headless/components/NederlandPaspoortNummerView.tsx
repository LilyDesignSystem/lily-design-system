// NederlandPaspoortNummerView component
//
// A headless display component for showing Netherlands's
// Paspoort Nummer in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <NederlandPaspoortNummerView label="Dutch Passport Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Dutch_passport

import React from "react";

export interface NederlandPaspoortNummerViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function NederlandPaspoortNummerView({
    className = "",
    label,
    value = "",
    ...restProps
}: NederlandPaspoortNummerViewProps) {
    return (
        <span
        className={`nederland-paspoort-nummer-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
