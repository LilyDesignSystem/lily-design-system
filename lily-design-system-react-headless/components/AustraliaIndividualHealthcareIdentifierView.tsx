// AustraliaIndividualHealthcareIdentifierView component
//
// A headless display component for showing Australia's
// Individual Healthcare Identifier (IHI) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <AustraliaIndividualHealthcareIdentifierView label="Individual Healthcare Identifier" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/My_Health_Record

import React from "react";

export interface AustraliaIndividualHealthcareIdentifierViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function AustraliaIndividualHealthcareIdentifierView({
    className = "",
    label,
    value = "",
    ...restProps
}: AustraliaIndividualHealthcareIdentifierViewProps) {
    return (
        <span
        className={`australia-individual-healthcare-identifier-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
