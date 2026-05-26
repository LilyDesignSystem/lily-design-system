// SlovenijaEmsoView component
//
// A headless display component for showing Slovenia's
// Enotna Matična Številka Občana (EMŠO) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <SlovenijaEmsoView label="Unique Master Citizen Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Unique_Master_Citizen_Number

import React from "react";

export interface SlovenijaEmsoViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function SlovenijaEmsoView({
    className = "",
    label,
    value = "",
    ...restProps
}: SlovenijaEmsoViewProps) {
    return (
        <span
        className={`slovenija-emso-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
