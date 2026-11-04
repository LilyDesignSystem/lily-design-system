// IbanView component
//
// A headless display component for showing an International Bank Account Number (IBAN) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <IbanView label="IBAN" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/International_Bank_Account_Number

import React from "react";

export interface IbanViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function IbanView({
    className = "",
    label,
    value = "",
    ...restProps
}: IbanViewProps) {
    return (
        <span
            className={`iban-view ${className}`}
            aria-label={label}
            {...restProps}
        >
            {value}
        </span>
    );
}
