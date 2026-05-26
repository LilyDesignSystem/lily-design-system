// MaltaPassportNumberView component
//
// A headless display component for showing Malta's
// Malta Passport Number in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <MaltaPassportNumberView label="Malta Passport Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Maltese_passport

import React from "react";

export interface MaltaPassportNumberViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function MaltaPassportNumberView({
    className = "",
    label,
    value = "",
    ...restProps
}: MaltaPassportNumberViewProps) {
    return (
        <span
        className={`malta-passport-number-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
