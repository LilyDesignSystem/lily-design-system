// SlovenskoRodneCisloView component
//
// A headless display component for showing Slovakia's
// Rodné číslo (RČ) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <SlovenskoRodneCisloView label="Slovak Personal Number" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_number#Slovakia

import React from "react";

export interface SlovenskoRodneCisloViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function SlovenskoRodneCisloView({
    className = "",
    label,
    value = "",
    ...restProps
}: SlovenskoRodneCisloViewProps) {
    return (
        <span
            className={`slovensko-rodne-cislo-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
