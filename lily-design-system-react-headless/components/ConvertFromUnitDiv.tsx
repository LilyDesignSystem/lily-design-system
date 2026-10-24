// ConvertFromUnitDiv component
//
// A headless part of ConvertDiv: the unit to convert from, such as a select box of currencies or lengths.
// Contract: a plain <div> with the base class and children.
// Converts nothing and carries no strings of its own.
//
// Props:
//   className    -- string, optional. CSS class name.
//   children     -- ReactNode, optional. The content.
//   ...restProps -- additional HTML attributes spread onto the root.

import React from "react";

export interface ConvertFromUnitDivProps {
    className?: string;
    /** The content. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ConvertFromUnitDiv({
    className = "",
    children,
    ...restProps
}: ConvertFromUnitDivProps) {
    return (
        <div
            className={`convert-from-unit-div ${className}`}
            {...restProps}
        >
            {children}
        </div>
    );
}
