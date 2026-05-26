// SuomiHenkilotunnusView component
//
// A headless display component for showing Finland's
// Henkilötunnus (HETU) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <SuomiHenkilotunnusView label="Personal Identity Code" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Personal_identity_code_(Finland)

import React from "react";

export interface SuomiHenkilotunnusViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function SuomiHenkilotunnusView({
    className = "",
    label,
    value = "",
    ...restProps
}: SuomiHenkilotunnusViewProps) {
    return (
        <span
        className={`suomi-henkilotunnus-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
