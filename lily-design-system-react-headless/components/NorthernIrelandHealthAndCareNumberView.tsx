// NorthernIrelandHealthAndCareNumberView component

import React from "react";

export interface NorthernIrelandHealthAndCareNumberViewProps {
    className?: string;
    label: string;
    value?: string;
    [key: string]: unknown;
}

export default function NorthernIrelandHealthAndCareNumberView({
    className = "",
    label,
    value = "",
    ...restProps
}: NorthernIrelandHealthAndCareNumberViewProps) {
    return (
        <span
            className={`northern-ireland-health-and-care-number-view ${className}`}
            aria-label={label}
            {...restProps}>{value}</span>
    );
}
