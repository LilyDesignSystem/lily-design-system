// OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView component
//
// A headless display component for showing Uzbekistan's
// Personal identification number (JShShIR / PINFL) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView label="Personal identification number (JShShIR / PINFL)" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://kun.uz/en/news/2026/01/26/how-to-find-your-pinfl

import React from "react";

export interface OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView({
    className = "",
    label,
    value = "",
    ...restProps
}: OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiViewProps) {
    return (
        <span
            className={`ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
