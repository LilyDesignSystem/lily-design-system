// ConvertIntoDiv component
//
// A headless part of ConvertDiv: the target side of a conversion, holding the value and unit to convert into.
// Contract: a plain <div> with the base class and children.
// Converts nothing and carries no strings of its own.
//
// Props:
//   className    -- string, optional. CSS class name.
//   children     -- ReactNode, optional. The content.
//   ...restProps -- additional HTML attributes spread onto the root.

import React from "react";

export interface ConvertIntoDivProps {
    className?: string;
    /** The content. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ConvertIntoDiv({
    className = "",
    children,
    ...restProps
}: ConvertIntoDivProps) {
    return (
        <div
            className={`convert-into-div ${className}`}
            {...restProps}
        >
            {children}
        </div>
    );
}
