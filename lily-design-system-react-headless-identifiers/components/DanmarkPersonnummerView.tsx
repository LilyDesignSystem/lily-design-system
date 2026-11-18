// DanmarkPersonnummerView component
//
// A headless display component for showing Denmark's
// Personnummer (CPR-nummer) (CPR) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <DanmarkPersonnummerView label="Personal Identity Code" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/Personal_identification_number_(Denmark)

import React from "react";

export interface DanmarkPersonnummerViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function DanmarkPersonnummerView({
    className = "",
    label,
    value = "",
    ...restProps
}: DanmarkPersonnummerViewProps) {
    return (
        <span
            className={`danmark-personnummer-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
