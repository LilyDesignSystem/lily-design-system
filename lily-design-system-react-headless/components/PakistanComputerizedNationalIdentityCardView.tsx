// PakistanComputerizedNationalIdentityCardView component
//
// A headless display component for showing Pakistan's
// Computerized National Identity Card Number (CNIC) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <PakistanComputerizedNationalIdentityCardView label="Computerized National Identity Card Number (CNIC)" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/Computerized_National_Identity_Card

import React from "react";

export interface PakistanComputerizedNationalIdentityCardViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
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
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
