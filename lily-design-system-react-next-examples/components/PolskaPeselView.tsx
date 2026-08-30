// PolskaPeselView component
//
// A headless display component for showing Poland's
// PESEL in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <PolskaPeselView label="PESEL" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/PESEL

import React from "react";

export interface PolskaPeselViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function PolskaPeselView({
    className = "",
    label,
    value = "",
    ...restProps
}: PolskaPeselViewProps) {
    return (
        <span
        className={`polska-pesel-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
