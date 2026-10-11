// SouthAfricaIdentityNumberView component
//
// A headless display component for showing South Africa's
// South African Identity Number in a read-only format.
// Format: Thirteen digits in the form YYMMDDSSSSCAZ: the first six encode date of birth; the next four encode sex (0000-4999 female, 5000-9999 male); the eleventh digit encodes citizenship status (0 citizen, 1 permanent resident, 2 refugee); the twelfth is a legacy field fixed at 8 on modern cards; the thirteenth is a Luhn (Modulus-10) check digit over the preceding twelve.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <SouthAfricaIdentityNumberView label="South African Identity Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/South_African_identity_card

import React from "react";

export interface SouthAfricaIdentityNumberViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function SouthAfricaIdentityNumberView({
    className = "",
    label,
    value = "",
    ...restProps
}: SouthAfricaIdentityNumberViewProps) {
    return (
        <span
        className={`south-africa-identity-number-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
