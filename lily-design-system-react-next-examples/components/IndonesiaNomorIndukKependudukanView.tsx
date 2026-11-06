// IndonesiaNomorIndukKependudukanView component
//
// A headless display component for showing Indonesia's
// Nomor Induk Kependudukan (NIK) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <IndonesiaNomorIndukKependudukanView label="Nomor Induk Kependudukan (NIK)" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_number

import React from "react";

export interface IndonesiaNomorIndukKependudukanViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function IndonesiaNomorIndukKependudukanView({
    className = "",
    label,
    value = "",
    ...restProps
}: IndonesiaNomorIndukKependudukanViewProps) {
    return (
        <span
            className={`indonesia-nomor-induk-kependudukan-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
