// MagyarorszagTajSzamView component
//
// A headless display component for showing Hungary's
// Társadalombiztosítási Azonosító Jel (TAJ) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <MagyarorszagTajSzamView label="Társadalombiztosítási Azonosító Jel (TAJ)" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://hu.wikipedia.org/wiki/T%C3%A1rsadalombiztos%C3%ADt%C3%A1si_azonos%C3%ADt%C3%B3_jel

import React from "react";

export interface MagyarorszagTajSzamViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
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
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
