// PortugalPassaporteView component
//
// A headless display component for showing Portugal's
// Passaporte in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <PortugalPassaporteView label="Portuguese Passport" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Portuguese_passport

import React from "react";

export interface PortugalPassaporteViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function PortugalPassaporteView({
    className = "",
    label,
    value = "",
    ...restProps
}: PortugalPassaporteViewProps) {
    return (
        <span
        className={`portugal-passaporte-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
