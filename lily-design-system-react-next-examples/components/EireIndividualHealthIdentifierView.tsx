// EireIndividualHealthIdentifierView component
//
// A headless display for an Eire IHI in read-only format.

import React from "react";

export interface EireIndividualHealthIdentifierViewProps {
    className?: string;
    label?: string;
    value?: string;
    [key: string]: unknown;
}

export default function EireIndividualHealthIdentifierView({
    className = "",
    label,
    value = "",
    ...restProps
}: EireIndividualHealthIdentifierViewProps) {
    return (
        <span
            className={`eire-individual-health-identifier-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
