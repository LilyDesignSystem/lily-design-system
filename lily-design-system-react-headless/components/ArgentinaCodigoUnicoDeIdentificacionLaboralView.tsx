// ArgentinaCodigoUnicoDeIdentificacionLaboralView component
//
// A headless display component for showing Argentina's
// Código Único de Identificación Laboral (CUIL) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <ArgentinaCodigoUnicoDeIdentificacionLaboralView label="Código Único de Identificación Laboral (CUIL)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/C%C3%B3digo_%C3%9Anico_de_Identificaci%C3%B3n_Laboral

import React from "react";

export interface ArgentinaCodigoUnicoDeIdentificacionLaboralViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function ArgentinaCodigoUnicoDeIdentificacionLaboralView({
    className = "",
    label,
    value = "",
    ...restProps
}: ArgentinaCodigoUnicoDeIdentificacionLaboralViewProps) {
    return (
        <span
        className={`argentina-codigo-unico-de-identificacion-laboral-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
