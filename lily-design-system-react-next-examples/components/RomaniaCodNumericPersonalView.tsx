// RomaniaCodNumericPersonalView component
//
// A headless display component for showing Romania's
// Cod Numeric Personal (CNP) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <RomaniaCodNumericPersonalView label="Personal Numerical Code" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_number#Romania

import React from "react";

export interface RomaniaCodNumericPersonalViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function RomaniaCodNumericPersonalView({
    className = "",
    label,
    value = "",
    ...restProps
}: RomaniaCodNumericPersonalViewProps) {
    return (
        <span
        className={`romania-cod-numeric-personal-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
