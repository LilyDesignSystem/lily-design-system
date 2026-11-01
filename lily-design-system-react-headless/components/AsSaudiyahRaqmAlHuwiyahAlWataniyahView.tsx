// AsSaudiyahRaqmAlHuwiyahAlWataniyahView component
//
// A headless display component for showing Saudi Arabia's
// National Identification Number in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <AsSaudiyahRaqmAlHuwiyahAlWataniyahView label="National Identification Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/National_identity_card

import React from "react";

export interface AsSaudiyahRaqmAlHuwiyahAlWataniyahViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function AsSaudiyahRaqmAlHuwiyahAlWataniyahView({
    className = "",
    label,
    value = "",
    ...restProps
}: AsSaudiyahRaqmAlHuwiyahAlWataniyahViewProps) {
    return (
        <span
            className={`as-saudiyah-raqm-al-huwiyah-al-wataniyah-view ${className}`}
            aria-label={label}
            {...restProps}
        >
            {value}
        </span>
    );
}
