// RomaniaPasaportView component
//
// A headless display component for showing Romania's
// Paşaport in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <RomaniaPasaportView label="Romanian Passport" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Romanian_passport

import React from "react";

export interface RomaniaPasaportViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function RomaniaPasaportView({
    className = "",
    label,
    value = "",
    ...restProps
}: RomaniaPasaportViewProps) {
    return (
        <span
        className={`romania-pasaport-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
