// ToolCallError component
//
// A headless inner part of ToolCall: the error shown when a tool call fails. Contract: `role="alert"` announces the error when it appears (open the tool call on error so it is not hidden inside a closed `<details>`).
// Draws nothing and carries no strings of its own; the consumer supplies the text.

import React from "react";

export interface ToolCallErrorProps {
    className?: string;

    /** The content. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ToolCallError({
    className = "",

    children,
    ...restProps
}: ToolCallErrorProps) {
    return (
        <div
            className={`tool-call-error ${className}`}
            role="alert"
            {...restProps}
        >
            {children}
        </div>
    );
}
