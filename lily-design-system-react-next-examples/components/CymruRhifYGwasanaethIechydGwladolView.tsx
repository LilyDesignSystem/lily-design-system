// CymruRhifYGwasanaethIechydGwladolView component
//
// A headless display component for showing Wales's
// Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <CymruRhifYGwasanaethIechydGwladolView label="National Health Service Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/NHS_number

import React from "react";

export interface CymruRhifYGwasanaethIechydGwladolViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function CymruRhifYGwasanaethIechydGwladolView({
    className = "",
    label,
    value = "",
    ...restProps
}: CymruRhifYGwasanaethIechydGwladolViewProps) {
    return (
        <span
        className={`cymru-rhif-y-gwasanaeth-iechyd-gwladol-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
