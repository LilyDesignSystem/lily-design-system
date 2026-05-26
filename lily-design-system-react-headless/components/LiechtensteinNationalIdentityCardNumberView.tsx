// LiechtensteinNationalIdentityCardNumberView component
//
// A headless display component for showing Liechtenstein's
// Liechtenstein National Identity Card Number in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <LiechtensteinNationalIdentityCardNumberView label="Liechtenstein National Identity Card Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/National_identity_card

import React from "react";

export interface LiechtensteinNationalIdentityCardNumberViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function LiechtensteinNationalIdentityCardNumberView({
    className = "",
    label,
    value = "",
    ...restProps
}: LiechtensteinNationalIdentityCardNumberViewProps) {
    return (
        <span
        className={`liechtenstein-national-identity-card-number-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
