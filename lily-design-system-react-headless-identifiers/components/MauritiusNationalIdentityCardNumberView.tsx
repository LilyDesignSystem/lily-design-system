// MauritiusNationalIdentityCardNumberView component
//
// A headless display component for showing Mauritius's
// National Identity Card number in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <MauritiusNationalIdentityCardNumberView label="National Identity Card number" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.mu.nid

import React from "react";

export interface MauritiusNationalIdentityCardNumberViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function MauritiusNationalIdentityCardNumberView({
    className = "",
    label,
    value = "",
    ...restProps
}: MauritiusNationalIdentityCardNumberViewProps) {
    return (
        <span
            className={`mauritius-national-identity-card-number-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
