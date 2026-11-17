// DurationView: a length of time in the consumer's words, in a <time> whose datetime is the ISO 8601 duration (tasks.md P29-T6). A negative
// duration renders its length as datetime and data-negative; years and months are no datetime. Props: DurationView.md.
import { merge, omit } from "solid-js";
import { attr } from "./attr";
import { htmlDuration } from "./clinical-format";
import { warnMissingProp } from "./dev-warning";

export interface DurationViewProps {
    class?: string;
    /** The length of time as the consumer writes it ("3 days 4 hours"). */
    value: string;
    /** The same length as an ISO 8601 duration of days, hours, minutes and seconds, optionally negative. */
    duration: string;
    /** Hidden text naming the value. */
    label?: string;
    [key: string]: unknown;
}

export default function DurationView(props: DurationViewProps) {
    const p = merge({ class: "" as const, value: "" as const, duration: "" as const }, props);
    const restProps = omit(p, "class", "value", "duration", "label");
    const parsed = () => htmlDuration(p.duration);
    warnMissingProp(
        "DurationView",
        "value",
        p.value,
        "a length of time needs words a person can read, never an ISO code alone.",
    );
    warnMissingProp(
        "DurationView",
        "duration",
        parsed()?.datetime,
        "datetime takes an ISO 8601 duration of days, hours, minutes and seconds; use age-view or plain text for years and months.",
    );
    return (
        <time
            class={`duration-view ${p.class}`}
            datetime={parsed()?.datetime}
            data-negative={attr(parsed()?.negative ? "" : undefined)}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </time>
    );
}
