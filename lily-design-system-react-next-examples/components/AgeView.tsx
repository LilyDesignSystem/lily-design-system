// AgeView: a person's age in the consumer's words, usually from ageParts() (spec/healthcare-ui item 6). Props: AgeView.md.
import React from "react";

export interface AgeViewProps {
    className?: string;
    label?: string;
    /** The age as the consumer writes it ("3 weeks 2 days"). */
    value: string;
    /** The same age as an ISO 8601 duration, as data-duration. */
    duration?: string;
    [key: string]: unknown;
}

export default function AgeView({
    className = "",
    label,
    value = "",
    duration,
    ...restProps
}: AgeViewProps) {
    return (
        <span
            className={`age-view ${className}`}
            data-duration={duration}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
