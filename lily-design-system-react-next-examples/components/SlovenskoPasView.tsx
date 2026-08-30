// SlovenskoPasView component
//
// A headless display component for showing Slovakia's
// Pas in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <SlovenskoPasView label="Slovak Passport" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Slovak_passport

import React from "react";

export interface SlovenskoPasViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function SlovenskoPasView({
    className = "",
    label,
    value = "",
    ...restProps
}: SlovenskoPasViewProps) {
    return (
        <span
        className={`slovensko-pas-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
