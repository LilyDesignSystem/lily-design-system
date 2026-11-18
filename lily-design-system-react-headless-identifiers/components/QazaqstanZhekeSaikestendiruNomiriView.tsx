// QazaqstanZhekeSaikestendiruNomiriView component
//
// A headless display component for showing Kazakhstan's
// Individual Identification Number (IIN) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <QazaqstanZhekeSaikestendiruNomiriView label="Individual Identification Number (IIN)" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Kazakhstan-TIN.pdf

import React from "react";

export interface QazaqstanZhekeSaikestendiruNomiriViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function QazaqstanZhekeSaikestendiruNomiriView({
    className = "",
    label,
    value = "",
    ...restProps
}: QazaqstanZhekeSaikestendiruNomiriViewProps) {
    return (
        <span
            className={`qazaqstan-zheke-saikestendiru-nomiri-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
