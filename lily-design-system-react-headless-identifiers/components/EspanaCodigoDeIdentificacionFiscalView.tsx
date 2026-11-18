// EspanaCodigoDeIdentificacionFiscalView component
//
// A headless display component for showing Spain's
// Código de Identificación Fiscal (CIF) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <EspanaCodigoDeIdentificacionFiscalView label="Tax Identification Code" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/VAT_identification_number#Spain

import React from "react";

export interface EspanaCodigoDeIdentificacionFiscalViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function EspanaCodigoDeIdentificacionFiscalView({
    className = "",
    label,
    value = "",
    ...restProps
}: EspanaCodigoDeIdentificacionFiscalViewProps) {
    return (
        <span
            className={`espana-codigo-de-identificacion-fiscal-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
