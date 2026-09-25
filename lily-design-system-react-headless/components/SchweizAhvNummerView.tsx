// SchweizAhvNummerView component
//
// A headless display component for showing Switzerland's
// AHV-Nummer / Numéro AVS in a read-only format.
// Format: Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit AHV card number on 1 July 2008.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <SchweizAhvNummerView label="AHV-Nummer / Numéro AVS" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Data_codes_for_Switzerland

import React from "react";

export interface SchweizAhvNummerViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function SchweizAhvNummerView({
    className = "",
    label,
    value = "",
    ...restProps
}: SchweizAhvNummerViewProps) {
    return (
        <span
        className={`schweiz-ahv-nummer-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
