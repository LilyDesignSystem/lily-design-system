// ConvertFromValueDiv component
//
// A headless part of ConvertDiv: the value to convert from, such as a text input holding the number of dollars.
// Contract: a plain <div> with the base class and children.
// Converts nothing and carries no strings of its own.
//
// Props:
//   className    -- string, optional. CSS class name.
//   children     -- ReactNode, optional. The content.
//   ...restProps -- additional HTML attributes spread onto the root.

import React from "react";

export interface ConvertFromValueDivProps {
    className?: string;
    /** The content. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ConvertFromValueDiv({
    className = "",
    children,
    ...restProps
}: ConvertFromValueDivProps) {
    return (
        <div
            className={`convert-from-value-div ${className}`}
            {...restProps}
        >
            {children}
        </div>
    );
}
