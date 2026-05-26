// DeutschlandKrankenversichertennummerView component
//
// A headless display component for showing Germany's
// Krankenversichertennummer (KVNR) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <DeutschlandKrankenversichertennummerView label="Health Insurance Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://de.wikipedia.org/wiki/Krankenversichertennummer

import React from "react";

export interface DeutschlandKrankenversichertennummerViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function DeutschlandKrankenversichertennummerView({
    className = "",
    label,
    value = "",
    ...restProps
}: DeutschlandKrankenversichertennummerViewProps) {
    return (
        <span
        className={`deutschland-krankenversichertennummer-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
