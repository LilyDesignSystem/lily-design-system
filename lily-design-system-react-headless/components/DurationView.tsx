// DurationView: a length of time in the consumer's words, in a <time> whose datetime is the ISO 8601 duration (tasks.md P29-T6). A negative
// duration renders its length as datetime and data-negative; years and months are no datetime. Props: DurationView.md.
import React from "react";
import { htmlDuration } from "./clinical-format";
import { warnMissingProp } from "./dev-warning";

export interface DurationViewProps {
    className?: string;
    /** The length of time as the consumer writes it ("3 days 4 hours"). */
    value: string;
    /** The same length as an ISO 8601 duration of days, hours, minutes and seconds, optionally negative. */
    duration: string;
    /** Hidden text naming the value. */
    label?: string;
    [key: string]: unknown;
}

export default function DurationView({
    className = "",
    value = "",
    duration = "",
    label,
    ...restProps
}: DurationViewProps) {
    const parsed = htmlDuration(duration);
    warnMissingProp(
        "DurationView",
        "value",
        value,
        "a length of time needs words a person can read, never an ISO code alone.",
    );
    warnMissingProp(
        "DurationView",
        "duration",
        parsed?.datetime,
        "datetime takes an ISO 8601 duration of days, hours, minutes and seconds; use age-view or plain text for years and months.",
    );
    return (
        <time
            className={`duration-view ${className}`}
            dateTime={parsed?.datetime}
            data-negative={parsed?.negative ? "" : undefined}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </time>
    );
}
