// NigeriaNationalIdentificationNumberView component
//
// A headless display component for showing Nigeria's
// National Identification Number (NIN) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <NigeriaNationalIdentificationNumberView label="National Identification Number (NIN)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/National_Identity_Management_Commission

import React from "react";

export interface NigeriaNationalIdentificationNumberViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function NigeriaNationalIdentificationNumberView({
    className = "",
    label,
    value = "",
    ...restProps
}: NigeriaNationalIdentificationNumberViewProps) {
    return (
        <span
            className={`nigeria-national-identification-number-view ${className}`}
            aria-label={label}
            {...restProps}
        >
            {value}
        </span>
    );
}
