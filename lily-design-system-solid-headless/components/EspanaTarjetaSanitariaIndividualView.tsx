// EspanaTarjetaSanitariaIndividualView component
//
// A headless display component for showing a España Tarjeta Sanitaria
// Individual (TSI) / CIP-SNS in a read-only format.
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling

import { merge, omit } from "solid-js";
export interface EspanaTarjetaSanitariaIndividualViewProps {
    class?: string;
    label?: string;
    value?: string;
    [key: string]: unknown;
}

export default function EspanaTarjetaSanitariaIndividualView(
    props: EspanaTarjetaSanitariaIndividualViewProps,
) {
    const p = merge({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "label", "value");
    return (
        <span
            class={`espana-tarjeta-sanitaria-individual-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
