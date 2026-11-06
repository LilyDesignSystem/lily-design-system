// BulgariaEdinenGrazhdanskiNomerView component
//
// A headless display component for showing Bulgaria's
// Единен граждански номер / Edinen grazhdanski nomer (EGN) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <BulgariaEdinenGrazhdanskiNomerView label="Uniform Civil Number" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/Unique_citizenship_number

import React from "react";

export interface BulgariaEdinenGrazhdanskiNomerViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function BulgariaEdinenGrazhdanskiNomerView({
    className = "",
    label,
    value = "",
    ...restProps
}: BulgariaEdinenGrazhdanskiNomerViewProps) {
    return (
        <span
            className={`bulgaria-edinen-grazhdanski-nomer-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
