// AgeView: a person's age in the consumer's words, usually from ageParts() (spec/healthcare-ui item 6). Props: AgeView.md.

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface AgeViewProps {
    class?: string;
    label?: string;
    /** The age as the consumer writes it ("3 weeks 2 days"). */
    value: string;
    /** The same age as an ISO 8601 duration, as data-duration. */
    duration?: string;
    [key: string]: unknown;
}

export default function AgeView(props: AgeViewProps) {
    const p = withDefaults({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "label", "value", "duration");
    return (
        <span
            class={`age-view ${p.class}`}
            data-duration={attr(p.duration)}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
