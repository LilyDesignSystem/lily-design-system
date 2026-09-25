// IndonesiaNomorIndukKependudukanView component
//
// A headless display component for showing Indonesia's
// Nomor Induk Kependudukan (NIK) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <IndonesiaNomorIndukKependudukanView label="Nomor Induk Kependudukan (NIK)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_number

import React from "react";

export interface IndonesiaNomorIndukKependudukanViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
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
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
