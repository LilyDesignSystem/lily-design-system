// YisraelTeudatZehutView component
//
// A headless display component for showing Israel's
// Teudat Zehut (תעודת זהות) in a read-only format.
// Format: Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10) check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over 9 has its own two digits summed, and the total must be a multiple of 10.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <YisraelTeudatZehutView label="Teudat Zehut (תעודת זהות)" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/Israeli_identity_card

import React from "react";

export interface YisraelTeudatZehutViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function YisraelTeudatZehutView({
    className = "",
    label,
    value = "",
    ...restProps
}: YisraelTeudatZehutViewProps) {
    return (
        <span
            className={`yisrael-teudat-zehut-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
