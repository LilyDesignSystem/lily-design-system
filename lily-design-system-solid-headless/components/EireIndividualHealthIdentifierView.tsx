// EireIndividualHealthIdentifierView component
//
// A headless display for an Eire IHI in read-only format.

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface EireIndividualHealthIdentifierViewProps {
    class?: string;
    label?: string;
    value?: string;
    [key: string]: unknown;
}

export default function EireIndividualHealthIdentifierView(
    props: EireIndividualHealthIdentifierViewProps,
) {
    const p = withDefaults({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "label", "value");
    return (
        <span
            class={`eire-individual-health-identifier-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
