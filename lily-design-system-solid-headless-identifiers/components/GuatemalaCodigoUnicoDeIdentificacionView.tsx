// GuatemalaCodigoUnicoDeIdentificacionView component
//
// A headless display component for showing Guatemala's
// Código Único de Identificación (CUI) in a read-only format.
//
// Props:
//   class — string, optional. CSS class name.
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

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface GuatemalaCodigoUnicoDeIdentificacionViewProps {
    class?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function GuatemalaCodigoUnicoDeIdentificacionView(
    props: GuatemalaCodigoUnicoDeIdentificacionViewProps,
) {
    const p = withDefaults({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "label", "value");
    return (
        <span
            class={`guatemala-codigo-unico-de-identificacion-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
