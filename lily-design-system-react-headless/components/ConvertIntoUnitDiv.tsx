// ConvertIntoUnitDiv component
//
// A headless part of ConvertDiv: the unit to convert into, such as a select box of currencies or lengths.
// Contract: a plain <div> with the base class and children.
// Converts nothing and carries no strings of its own.
//
// Props:
//   className    -- string, optional. CSS class name.
//   children     -- ReactNode, optional. The content.
//   ...restProps -- additional HTML attributes spread onto the root.

import React from "react";

export interface ConvertIntoUnitDivProps {
    className?: string;
    /** The content. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ConvertIntoUnitDiv({
    className = "",
    children,
    ...restProps
}: ConvertIntoUnitDivProps) {
    return (
        <div
            className={`convert-into-unit-div ${className}`}
            {...restProps}
        >
            {children}
        </div>
    );
}
