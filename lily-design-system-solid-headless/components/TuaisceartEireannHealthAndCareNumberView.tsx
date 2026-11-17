// TuaisceartEireannHealthAndCareNumberView component

import { merge, omit } from "solid-js";
export interface TuaisceartEireannHealthAndCareNumberViewProps {
    class?: string;
    label?: string;
    value?: string;
    [key: string]: unknown;
}

export default function TuaisceartEireannHealthAndCareNumberView(
    props: TuaisceartEireannHealthAndCareNumberViewProps,
) {
    const p = merge({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "label", "value");
    return (
        <span
            class={`tuaisceart-eireann-health-and-care-number-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
