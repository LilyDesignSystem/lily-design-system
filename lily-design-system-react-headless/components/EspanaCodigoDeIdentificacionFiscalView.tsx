// EspanaCodigoDeIdentificacionFiscalView component
//
// A headless display component for showing Spain's
// Código de Identificación Fiscal (CIF) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <EspanaCodigoDeIdentificacionFiscalView label="Tax Identification Code" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/VAT_identification_number#Spain

import React from "react";

export interface EspanaCodigoDeIdentificacionFiscalViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
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
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
