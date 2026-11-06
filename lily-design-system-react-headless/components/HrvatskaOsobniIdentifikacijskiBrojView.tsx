// HrvatskaOsobniIdentifikacijskiBrojView component
//
// A headless display component for showing Croatia's
// Osobni identifikacijski broj (OIB) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <HrvatskaOsobniIdentifikacijskiBrojView label="Personal Identification Number" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/Personal_identification_number_(Croatia)

import React from "react";

export interface HrvatskaOsobniIdentifikacijskiBrojViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function HrvatskaOsobniIdentifikacijskiBrojView({
    className = "",
    label,
    value = "",
    ...restProps
}: HrvatskaOsobniIdentifikacijskiBrojViewProps) {
    return (
        <span
            className={`hrvatska-osobni-identifikacijski-broj-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
