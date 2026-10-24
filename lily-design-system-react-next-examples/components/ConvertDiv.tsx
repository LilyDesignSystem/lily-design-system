// ConvertDiv component
//
// A headless part of ConvertDiv: a group that converts a value from one unit into another, such as dollars into euros or miles into kilometres.
// Contract: a plain <div> with the base class and children; role="group" named by `label`.
// Converts nothing and carries no strings of its own.
//
// Props:
//   className    -- string, optional. CSS class name.
//   label        -- string, required. Accessible name of the group (aria-label).
//   children     -- ReactNode, optional. The content.
//   ...restProps -- additional HTML attributes spread onto the root.

import React from "react";

export interface ConvertDivProps {
    className?: string;
    /** Accessible name of the group. */
    label: string;
    /** The content. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ConvertDiv({
    className = "",
    label,
    children,
    ...restProps
}: ConvertDivProps) {
    return (
        <div
            className={`convert-div ${className}`}
            role="group"
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
