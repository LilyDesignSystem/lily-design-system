// PilipinasPhilhealthIdentificationNumberView component
//
// A headless display component for showing the Philippines's
// PhilHealth Identification Number (PIN) in a read-only format.
// Format: Twelve-digit number assigned by the Philippine Health Insurance Corporation (PhilHealth) to every enrolled member, commonly displayed grouped as NN-NNNNNNNNN-N. No published check-digit algorithm; correctness is confirmed against PhilHealth's own membership records.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <PilipinasPhilhealthIdentificationNumberView label="PhilHealth Identification Number (PIN)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/PhilHealth

import React from "react";

export interface PilipinasPhilhealthIdentificationNumberViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function PilipinasPhilhealthIdentificationNumberView({
    className = "",
    label,
    value = "",
    ...restProps
}: PilipinasPhilhealthIdentificationNumberViewProps) {
    return (
        <span
        className={`pilipinas-philhealth-identification-number-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
