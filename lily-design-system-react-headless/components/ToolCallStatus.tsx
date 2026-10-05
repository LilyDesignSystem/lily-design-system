// ToolCallStatus component
//
// A headless inner part of ToolCall: the status of a tool call as a word, such as pending, running, done or error. Contract: `status` (optional) sets `data-status`; the visible status word is the children (consumer text, never colour alone).
// Draws nothing and carries no strings of its own; the consumer supplies the text.

import React from "react";

export interface ToolCallStatusProps {
    className?: string;
    /** Status: pending, running, done or error. */
    status?: string;
    /** The content. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ToolCallStatus({
    className = "",
    status = undefined,
    children,
    ...restProps
}: ToolCallStatusProps) {
    return (
        <span
            className={`tool-call-status ${className}`}
            data-status={status}
            {...restProps}
        >
            {children}
        </span>
    );
}
