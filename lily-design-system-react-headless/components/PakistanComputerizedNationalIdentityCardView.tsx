// PakistanComputerizedNationalIdentityCardView component
//
// A headless display component for showing Pakistan's
// Computerized National Identity Card Number (CNIC) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <PakistanComputerizedNationalIdentityCardView label="Computerized National Identity Card Number (CNIC)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Computerized_National_Identity_Card

import React from "react";

export interface PakistanComputerizedNationalIdentityCardViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function PakistanComputerizedNationalIdentityCardView({
    className = "",
    label,
    value = "",
    ...restProps
}: PakistanComputerizedNationalIdentityCardViewProps) {
    return (
        <span
            className={`pakistan-computerized-national-identity-card-view ${className}`}
            aria-label={label}
            {...restProps}
        >
            {value}
        </span>
    );
}
