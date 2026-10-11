// NihonKojinBangoView component
//
// A headless display component for showing Japan's
// Individual Number / My Number (マイナンバー) in a read-only format.
// Format: Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <NihonKojinBangoView label="Individual Number / My Number (マイナンバー)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Individual_Number

import React from "react";

export interface NihonKojinBangoViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function NihonKojinBangoView({
    className = "",
    label,
    value = "",
    ...restProps
}: NihonKojinBangoViewProps) {
    return (
        <span
        className={`nihon-kojin-bango-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
