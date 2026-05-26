// DanmarkPersonnummerView component
//
// A headless display component for showing Denmark's
// Personnummer (CPR-nummer) (CPR) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <DanmarkPersonnummerView label="Personal Identity Code" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Personal_identification_number_(Denmark)

import React from "react";

export interface DanmarkPersonnummerViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
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
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
