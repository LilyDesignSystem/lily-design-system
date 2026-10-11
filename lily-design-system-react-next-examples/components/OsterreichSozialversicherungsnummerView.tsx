// OsterreichSozialversicherungsnummerView component
//
// A headless display component for showing Austria's
// Sozialversicherungsnummer (SVNR) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <OsterreichSozialversicherungsnummerView label="Sozialversicherungsnummer (SVNR)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://de.wikipedia.org/wiki/Sozialversicherungsnummer

import React from "react";

export interface OsterreichSozialversicherungsnummerViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function OsterreichSozialversicherungsnummerView({
    className = "",
    label,
    value = "",
    ...restProps
}: OsterreichSozialversicherungsnummerViewProps) {
    return (
        <span
        className={`osterreich-sozialversicherungsnummer-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
