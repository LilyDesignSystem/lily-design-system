// LuxembourgMatriculeView component
//
// A headless display component for showing Luxembourg's
// Matricule National in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <LuxembourgMatriculeView label="Matricule National" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://ccss.public.lu/fr/glossaire/numero-identification-national/matricule-national.html

import React from "react";

export interface LuxembourgMatriculeViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function LuxembourgMatriculeView({
    className = "",
    label,
    value = "",
    ...restProps
}: LuxembourgMatriculeViewProps) {
    return (
        <span
        className={`luxembourg-matricule-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
