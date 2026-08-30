// SverigePersonnummerView component
//
// A headless display component for showing Sweden's
// Personnummer in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <SverigePersonnummerView label="Personal Identity Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)

import React from "react";

export interface SverigePersonnummerViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function SverigePersonnummerView({
    className = "",
    label,
    value = "",
    ...restProps
}: SverigePersonnummerViewProps) {
    return (
        <span
        className={`sverige-personnummer-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
