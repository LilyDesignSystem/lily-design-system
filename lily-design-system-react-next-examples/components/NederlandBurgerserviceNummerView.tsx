// NederlandBurgerserviceNummerView component
//
// A headless display component for showing Netherlands's
// Burgerservicenummer (BSN) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <NederlandBurgerserviceNummerView label="Citizen Service Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Burgerservicenummer

import React from "react";

export interface NederlandBurgerserviceNummerViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function NederlandBurgerserviceNummerView({
    className = "",
    label,
    value = "",
    ...restProps
}: NederlandBurgerserviceNummerViewProps) {
    return (
        <span
        className={`nederland-burgerservice-nummer-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
