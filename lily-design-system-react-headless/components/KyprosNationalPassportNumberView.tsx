// KyprosNationalPassportNumberView component
//
// A headless display component for showing Kypros's
// National Passport Number in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <KyprosNationalPassportNumberView label="National Passport Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Cypriot_passport

import React from "react";

export interface KyprosNationalPassportNumberViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function KyprosNationalPassportNumberView({
    className = "",
    label,
    value = "",
    ...restProps
}: KyprosNationalPassportNumberViewProps) {
    return (
        <span
        className={`kypros-national-passport-number-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
