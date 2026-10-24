// ConvertIntoValueDiv component
//
// A headless part of ConvertDiv: the converted value, such as a text input showing the number of euros.
// Contract: a plain <div> with the base class and children.
// Converts nothing and carries no strings of its own.
//
// Props:
//   className    -- string, optional. CSS class name.
//   children     -- ReactNode, optional. The content.
//   ...restProps -- additional HTML attributes spread onto the root.

import React from "react";

export interface ConvertIntoValueDivProps {
    className?: string;
    /** The content. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ConvertIntoValueDiv({
    className = "",
    children,
    ...restProps
}: ConvertIntoValueDivProps) {
    return (
        <div
            className={`convert-into-value-div ${className}`}
            {...restProps}
        >
            {children}
        </div>
    );
}
