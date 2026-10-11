// TurkiyeTcKimlikNumarasiView component
//
// A headless display component for showing Turkey's
// T.C. Kimlik Numarası in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <TurkiyeTcKimlikNumarasiView label="T.C. Kimlik Numarası" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Turkish_Identification_Number

import React from "react";

export interface TurkiyeTcKimlikNumarasiViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function TurkiyeTcKimlikNumarasiView({
    className = "",
    label,
    value = "",
    ...restProps
}: TurkiyeTcKimlikNumarasiViewProps) {
    return (
        <span
        className={`turkiye-tc-kimlik-numarasi-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
