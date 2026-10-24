// ConvertFromDiv component
//
// A headless part of ConvertDiv: the source side of a conversion, holding the value and unit to convert from.
// Contract: a plain <div> with the base class and children.
// Converts nothing and carries no strings of its own.
//
// Props:
//   className    -- string, optional. CSS class name.
//   children     -- ReactNode, optional. The content.
//   ...restProps -- additional HTML attributes spread onto the root.

import React from "react";

export interface ConvertFromDivProps {
    className?: string;
    /** The content. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ConvertFromDiv({
    className = "",
    children,
    ...restProps
}: ConvertFromDivProps) {
    return (
        <div
            className={`convert-from-div ${className}`}
            {...restProps}
        >
            {children}
        </div>
    );
}
