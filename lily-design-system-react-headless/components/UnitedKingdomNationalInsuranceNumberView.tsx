// UnitedKingdomNationalInsuranceNumberView component
//
// A headless display component for showing United Kingdom's
// National Insurance Number (NINO) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <UnitedKingdomNationalInsuranceNumberView label="National Insurance Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/National_Insurance_number

import React from "react";

export interface UnitedKingdomNationalInsuranceNumberViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function UnitedKingdomNationalInsuranceNumberView({
    className = "",
    label,
    value = "",
    ...restProps
}: UnitedKingdomNationalInsuranceNumberViewProps) {
    return (
        <span
        className={`united-kingdom-national-insurance-number-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
