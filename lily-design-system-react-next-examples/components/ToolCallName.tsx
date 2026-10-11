// ToolCallName component
//
// A headless inner part of ToolCall: the name of the tool in a tool call, shown in the summary. Contract: a plain wrapper with the base class and children.
// Draws nothing and carries no strings of its own; the consumer supplies the text.

import React from "react";

export interface ToolCallNameProps {
    className?: string;

    /** The content. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ToolCallName({
    className = "",

    children,
    ...restProps
}: ToolCallNameProps) {
    return (
        <span
            className={`tool-call-name ${className}`}

            {...restProps}
        >
            {children}
        </span>
    );
}
