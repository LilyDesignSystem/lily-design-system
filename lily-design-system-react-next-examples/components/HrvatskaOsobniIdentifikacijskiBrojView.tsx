// HrvatskaOsobniIdentifikacijskiBrojView component
//
// A headless display component for showing Croatia's
// Osobni identifikacijski broj (OIB) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <HrvatskaOsobniIdentifikacijskiBrojView label="Personal Identification Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Personal_identification_number_(Croatia)

import React from "react";

export interface HrvatskaOsobniIdentifikacijskiBrojViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function HrvatskaOsobniIdentifikacijskiBrojView({
    className = "",
    label,
    value = "",
    ...restProps
}: HrvatskaOsobniIdentifikacijskiBrojViewProps) {
    return (
        <span
        className={`hrvatska-osobni-identifikacijski-broj-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
