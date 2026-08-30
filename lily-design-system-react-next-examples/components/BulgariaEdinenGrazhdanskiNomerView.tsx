// BulgariaEdinenGrazhdanskiNomerView component
//
// A headless display component for showing Bulgaria's
// Единен граждански номер / Edinen grazhdanski nomer (EGN) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <BulgariaEdinenGrazhdanskiNomerView label="Uniform Civil Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Unique_citizenship_number

import React from "react";

export interface BulgariaEdinenGrazhdanskiNomerViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
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
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
