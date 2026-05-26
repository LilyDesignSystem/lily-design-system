// SlovenskoRodneCisloView component
//
// A headless display component for showing Slovakia's
// Rodné číslo (RČ) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <SlovenskoRodneCisloView label="Slovak Personal Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_number#Slovakia

import React from "react";

export interface SlovenskoRodneCisloViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function SlovenskoRodneCisloView({
    className = "",
    label,
    value = "",
    ...restProps
}: SlovenskoRodneCisloViewProps) {
    return (
        <span
        className={`slovensko-rodne-cislo-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
