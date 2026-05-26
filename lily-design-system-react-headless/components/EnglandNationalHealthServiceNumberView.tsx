// EnglandNationalHealthServiceNumberView component
//
// A headless display component for showing England's
// National Health Service Number (NHS) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <EnglandNationalHealthServiceNumberView label="National Health Service Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/NHS_number

import React from "react";

export interface EnglandNationalHealthServiceNumberViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function EnglandNationalHealthServiceNumberView({
    className = "",
    label,
    value = "",
    ...restProps
}: EnglandNationalHealthServiceNumberViewProps) {
    return (
        <span
        className={`england-national-health-service-number-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
