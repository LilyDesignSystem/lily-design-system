// GuatemalaCodigoUnicoDeIdentificacionView component
//
// A headless display component for showing Guatemala's
// Código Único de Identificación (CUI) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <GuatemalaCodigoUnicoDeIdentificacionView label="Código Único de Identificación (CUI)" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://www.renap.gob.gt/sites/default/files/boletines-publicaciones/inforenap_163_-_08042021_-_que_es_el_cui.pdf

import React from "react";

export interface GuatemalaCodigoUnicoDeIdentificacionViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function GuatemalaCodigoUnicoDeIdentificacionView({
    className = "",
    label,
    value = "",
    ...restProps
}: GuatemalaCodigoUnicoDeIdentificacionViewProps) {
    return (
        <span
            className={`guatemala-codigo-unico-de-identificacion-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
