// ArgentinaCodigoUnicoDeIdentificacionLaboralView component
//
// A headless display component for showing Argentina's
// Código Único de Identificación Laboral (CUIL) in a read-only format.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <ArgentinaCodigoUnicoDeIdentificacionLaboralView label="Código Único de Identificación Laboral (CUIL)" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/C%C3%B3digo_%C3%9Anico_de_Identificaci%C3%B3n_Laboral

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface ArgentinaCodigoUnicoDeIdentificacionLaboralViewProps {
    class?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function ArgentinaCodigoUnicoDeIdentificacionLaboralView(
    props: ArgentinaCodigoUnicoDeIdentificacionLaboralViewProps,
) {
    const p = withDefaults({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "label", "value");
    return (
        <span
            class={`argentina-codigo-unico-de-identificacion-laboral-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
