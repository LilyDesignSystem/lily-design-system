// HangukJuminDeungnokBeonhoView component
//
// A headless display component for showing South Korea's
// Resident Registration Number (주민등록번호) in a read-only format.
// Format: Thirteen digits, displayed as NNNNNN-NNNNNNN. The first six digits encode date of birth (YYMMDD); the seventh digit encodes sex and birth century; digits eight through eleven encode place of registration; the twelfth is a sequence number; the thirteenth is a Modulus-11 check digit over the preceding twelve.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <HangukJuminDeungnokBeonhoView label="Resident Registration Number (주민등록번호)" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/Resident_registration_number

import React from "react";

export interface HangukJuminDeungnokBeonhoViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function HangukJuminDeungnokBeonhoView({
    className = "",
    label,
    value = "",
    ...restProps
}: HangukJuminDeungnokBeonhoViewProps) {
    return (
        <span
            className={`hanguk-jumin-deungnok-beonho-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
