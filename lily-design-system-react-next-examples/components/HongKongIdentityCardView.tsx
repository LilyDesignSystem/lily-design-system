// HongKongIdentityCardView component
//
// A headless display component for showing Hong Kong's
// Hong Kong Identity Card Number in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <HongKongIdentityCardView label="Hong Kong Identity Card Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Hong_Kong_identity_card

import React from "react";

export interface HongKongIdentityCardViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
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
            aria-label={label}
            {...restProps}
        >
            {value}
        </span>
    );
}
