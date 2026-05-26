// NorgeFodselsnummerView component
//
// A headless display component for showing Norway's
// Fødselsnummer in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <NorgeFodselsnummerView label="Norwegian Birth Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_number#Norway

import React from "react";

export interface NorgeFodselsnummerViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function NorgeFodselsnummerView({
    className = "",
    label,
    value = "",
    ...restProps
}: NorgeFodselsnummerViewProps) {
    return (
        <span
        className={`norge-fodselsnummer-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
