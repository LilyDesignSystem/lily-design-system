// CeskoCestovniPasView component
//
// A headless display component for showing Czech Republic's
// Cestovní pas in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <CeskoCestovniPasView label="Czech Passport" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Czech_passport

import React from "react";

export interface CeskoCestovniPasViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function CeskoCestovniPasView({
    className = "",
    label,
    value = "",
    ...restProps
}: CeskoCestovniPasViewProps) {
    return (
        <span
        className={`cesko-cestovni-pas-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
