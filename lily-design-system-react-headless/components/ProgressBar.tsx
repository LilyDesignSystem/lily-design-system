// ProgressBar component
// A horizontal progress indicator.

import React from "react";

export interface ProgressBarProps {
    className?: string;
    label: string;
    value: number;
    min?: number;
    max?: number;
    [key: string]: unknown;
}

export default function ProgressBar({
    className = "",
    label,
    value,
    min = 0,
    max = 100,
    ...restProps
}: ProgressBarProps) {
    return (
        <div className={`progress-bar ${className}`} role="progressbar" aria-valuenow={value} aria-valuemin={min} aria-valuemax={max} aria-label={label} {...restProps} />
    );
}
