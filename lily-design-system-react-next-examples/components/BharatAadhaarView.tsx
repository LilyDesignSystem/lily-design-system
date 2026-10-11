// BharatAadhaarView component
//
// A headless display component for showing India's
// Aadhaar (आधार) in a read-only format.
// Format: Twelve digits, the first of which is never 0 or 1. The twelfth digit is a check digit computed with the Verhoeff algorithm, a checksum that detects every single-digit error and every adjacent-digit transposition. Issued by the Unique Identification Authority of India (UIDAI).
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <BharatAadhaarView label="Aadhaar (आधार)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Aadhaar

import React from "react";

export interface BharatAadhaarViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function BharatAadhaarView({
    className = "",
    label,
    value = "",
    ...restProps
}: BharatAadhaarViewProps) {
    return (
        <span
        className={`bharat-aadhaar-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
