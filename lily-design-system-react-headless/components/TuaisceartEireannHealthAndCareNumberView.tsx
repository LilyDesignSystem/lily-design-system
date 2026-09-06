// TuaisceartEireannHealthAndCareNumberView component

import React from "react";

export interface TuaisceartEireannHealthAndCareNumberViewProps {
    className?: string;
    label: string;
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
            aria-label={label}
            {...restProps}>{value}</span>
    );
}
