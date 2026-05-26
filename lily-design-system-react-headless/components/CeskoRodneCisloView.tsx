// CeskoRodneCisloView component
//
// A headless display component for showing Czech Republic's
// Rodné číslo (RČ) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <CeskoRodneCisloView label="Czech Personal Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic

import React from "react";

export interface CeskoRodneCisloViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function CeskoRodneCisloView({
    className = "",
    label,
    value = "",
    ...restProps
}: CeskoRodneCisloViewProps) {
    return (
        <span
        className={`cesko-rodne-cislo-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
