// PrathetThaiLekPrajamTuaPrachachonView component
//
// A headless display component for showing Thailand's
// National Identification Number (เลขประจำตัวประชาชน) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <PrathetThaiLekPrajamTuaPrachachonView label="National Identification Number (เลขประจำตัวประชาชน)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Thai_identity_card

import React from "react";

export interface PrathetThaiLekPrajamTuaPrachachonViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function PrathetThaiLekPrajamTuaPrachachonView({
    className = "",
    label,
    value = "",
    ...restProps
}: PrathetThaiLekPrajamTuaPrachachonViewProps) {
    return (
        <span
        className={`prathet-thai-lek-prajam-tua-prachachon-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
