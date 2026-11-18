// SriLankaNationalIdentityCardView component
//
// A headless display component for showing Sri Lanka's
// National Identity Card (NIC) number in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <SriLankaNationalIdentityCardView label="National Identity Card (NIC) number" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/National_identity_card_(Sri_Lanka)

import React from "react";

export interface SriLankaNationalIdentityCardViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function SriLankaNationalIdentityCardView({
    className = "",
    label,
    value = "",
    ...restProps
}: SriLankaNationalIdentityCardViewProps) {
    return (
        <span
            className={`sri-lanka-national-identity-card-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
