// TuaisceartEireannHealthAndCareNumberView component

import React from "react";

export interface TuaisceartEireannHealthAndCareNumberViewProps {
    className?: string;
    label?: string;
    value?: string;
    [key: string]: unknown;
}

export default function TuaisceartEireannHealthAndCareNumberView({
    className = "",
    label,
    value = "",
    ...restProps
}: TuaisceartEireannHealthAndCareNumberViewProps) {
    return (
        <span
            className={`tuaisceart-eireann-health-and-care-number-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
