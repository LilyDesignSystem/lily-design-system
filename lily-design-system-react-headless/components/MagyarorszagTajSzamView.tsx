// MagyarorszagTajSzamView component
//
// A headless display component for showing Hungary's
// Társadalombiztosítási Azonosító Jel (TAJ) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <MagyarorszagTajSzamView label="Társadalombiztosítási Azonosító Jel (TAJ)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://hu.wikipedia.org/wiki/T%C3%A1rsadalombiztos%C3%ADt%C3%A1si_azonos%C3%ADt%C3%B3_jel

import React from "react";

export interface MagyarorszagTajSzamViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function MagyarorszagTajSzamView({
    className = "",
    label,
    value = "",
    ...restProps
}: MagyarorszagTajSzamViewProps) {
    return (
        <span
        className={`magyarorszag-taj-szam-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
