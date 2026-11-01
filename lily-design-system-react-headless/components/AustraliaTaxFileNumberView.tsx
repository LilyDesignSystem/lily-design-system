// AustraliaTaxFileNumberView component
//
// A headless display component for showing Australia's
// Tax File Number (TFN) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <AustraliaTaxFileNumberView label="Tax File Number (TFN)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Tax_file_number

import React from "react";

export interface AustraliaTaxFileNumberViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function AustraliaTaxFileNumberView({
    className = "",
    label,
    value = "",
    ...restProps
}: AustraliaTaxFileNumberViewProps) {
    return (
        <span
            className={`australia-tax-file-number-view ${className}`}
            aria-label={label}
            {...restProps}
        >
            {value}
        </span>
    );
}
