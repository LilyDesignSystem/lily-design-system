// IslandKennitalaView component
//
// A headless display component for showing Iceland's
// Kennitala in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <IslandKennitalaView label="Personal Identity Code" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Kennitala

import React from "react";

export interface IslandKennitalaViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function IslandKennitalaView({
    className = "",
    label,
    value = "",
    ...restProps
}: IslandKennitalaViewProps) {
    return (
        <span
        className={`island-kennitala-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
