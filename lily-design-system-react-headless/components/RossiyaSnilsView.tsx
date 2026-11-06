// RossiyaSnilsView component
//
// A headless display component for showing Russia's
// SNILS (СНИЛС) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <RossiyaSnilsView label="SNILS (СНИЛС)" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/SNILS_(Russia)

import React from "react";

export interface RossiyaSnilsViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function RossiyaSnilsView({
    className = "",
    label,
    value = "",
    ...restProps
}: RossiyaSnilsViewProps) {
    return (
        <span
            className={`rossiya-snils-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
