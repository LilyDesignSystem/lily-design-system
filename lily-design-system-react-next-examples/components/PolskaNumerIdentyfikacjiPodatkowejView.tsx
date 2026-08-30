// PolskaNumerIdentyfikacjiPodatkowejView component
//
// A headless display component for showing Poland's
// Numer Identyfikacji Podatkowej (NIP) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <PolskaNumerIdentyfikacjiPodatkowejView label="Tax Identification Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_number#Poland

import React from "react";

export interface PolskaNumerIdentyfikacjiPodatkowejViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function PolskaNumerIdentyfikacjiPodatkowejView({
    className = "",
    label,
    value = "",
    ...restProps
}: PolskaNumerIdentyfikacjiPodatkowejViewProps) {
    return (
        <span
        className={`polska-numer-identyfikacji-podatkowej-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
