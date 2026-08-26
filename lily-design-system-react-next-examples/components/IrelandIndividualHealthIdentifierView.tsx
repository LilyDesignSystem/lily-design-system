// IrelandIndividualHealthIdentifierView component
//
// A headless display for an Ireland IHI in read-only format.

import React from "react";

export interface IrelandIndividualHealthIdentifierViewProps {
    className?: string;
    label: string;
    value?: string;
    [key: string]: unknown;
}

export default function IrelandIndividualHealthIdentifierView({
    className = "",
    label,
    value = "",
    ...restProps
}: IrelandIndividualHealthIdentifierViewProps) {
    return (
        <span
            className={`ireland-individual-health-identifier-view ${className}`}
            aria-label={label}
            {...restProps}>{value}</span>
    );
}
