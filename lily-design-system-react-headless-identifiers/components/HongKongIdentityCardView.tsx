// HongKongIdentityCardView component
//
// A headless display component for showing Hong Kong's
// Hong Kong Identity Card Number in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <HongKongIdentityCardView label="Hong Kong Identity Card Number" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/Hong_Kong_identity_card

import React from "react";

export interface HongKongIdentityCardViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function HongKongIdentityCardView({
    className = "",
    label,
    value = "",
    ...restProps
}: HongKongIdentityCardViewProps) {
    return (
        <span
            className={`hong-kong-identity-card-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
