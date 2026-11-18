// CostaRicaCedulaDeIdentidadView component
//
// A headless display component for showing Costa Rica's
// Cédula de Identidad in a read-only format.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <CostaRicaCedulaDeIdentidadView label="Cédula de Identidad" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://es.wikipedia.org/wiki/C%C3%A9dula_de_identidad_(Costa_Rica)

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface CostaRicaCedulaDeIdentidadViewProps {
    class?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function CostaRicaCedulaDeIdentidadView(props: CostaRicaCedulaDeIdentidadViewProps) {
    const p = withDefaults({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "label", "value");
    return (
        <span
            class={`costa-rica-cedula-de-identidad-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
