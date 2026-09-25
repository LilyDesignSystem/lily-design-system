// AotearoaNationalHealthIndexView component
//
// A headless display component for showing New Zealand's
// National Health Index (NHI) Number in a read-only format.
// Format: Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <AotearoaNationalHealthIndexView label="National Health Index (NHI) Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/NHI_Number

import React from "react";

export interface AotearoaNationalHealthIndexViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function AotearoaNationalHealthIndexView({
    className = "",
    label,
    value = "",
    ...restProps
}: AotearoaNationalHealthIndexViewProps) {
    return (
        <span
        className={`aotearoa-national-health-index-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
