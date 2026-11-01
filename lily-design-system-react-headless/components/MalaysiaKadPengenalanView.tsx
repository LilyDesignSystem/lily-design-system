// MalaysiaKadPengenalanView component
//
// A headless display component for showing Malaysia's
// MyKad Number (NRIC) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <MalaysiaKadPengenalanView label="MyKad Number (NRIC)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/MyKad

import React from "react";

export interface MalaysiaKadPengenalanViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function MalaysiaKadPengenalanView({
    className = "",
    label,
    value = "",
    ...restProps
}: MalaysiaKadPengenalanViewProps) {
    return (
        <span
            className={`malaysia-kad-pengenalan-view ${className}`}
            aria-label={label}
            {...restProps}
        >
            {value}
        </span>
    );
}
