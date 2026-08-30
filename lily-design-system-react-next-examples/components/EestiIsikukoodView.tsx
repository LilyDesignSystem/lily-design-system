// EestiIsikukoodView component
//
// A headless display component for showing Estonia's
// Isikukood (IK) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <EestiIsikukoodView label="Personal Identification Code" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_number#Estonia

import React from "react";

export interface EestiIsikukoodViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function EestiIsikukoodView({
    className = "",
    label,
    value = "",
    ...restProps
}: EestiIsikukoodViewProps) {
    return (
        <span
        className={`eesti-isikukood-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
