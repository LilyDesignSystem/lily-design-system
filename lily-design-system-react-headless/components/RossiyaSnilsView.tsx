// RossiyaSnilsView component
//
// A headless display component for showing Russia's
// SNILS (СНИЛС) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <RossiyaSnilsView label="SNILS (СНИЛС)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/SNILS_(Russia)

import React from "react";

export interface RossiyaSnilsViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function RossiyaSnilsView({
    className = "",
    label,
    value = "",
    ...restProps
}: RossiyaSnilsViewProps) {
    return (
        <span
        className={`rossiya-snils-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
