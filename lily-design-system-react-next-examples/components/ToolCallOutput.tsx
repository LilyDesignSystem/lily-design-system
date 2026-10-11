// ToolCallOutput component
//
// A headless inner part of ToolCall: the output or result returned by a tool in a tool call. Contract: `label` (optional) sets `role="group"` and `aria-label`; without it neither is rendered.
// Draws nothing and carries no strings of its own; the consumer supplies the text.

import React from "react";

export interface ToolCallOutputProps {
    className?: string;
    /** Accessible name of the group. */
    label?: string;
    /** The content. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ToolCallOutput({
    className = "",
    label = undefined,
    children,
    ...restProps
}: ToolCallOutputProps) {
    return (
        <div
            className={`tool-call-output ${className}`}
            role={label ? "group" : undefined}
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
