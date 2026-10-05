// ToolCall component
//
// A headless disclosure for one tool invocation, built on the native <details>. Closed by default. The `summary` content (typically ToolCallName and ToolCallStatus) goes inside <summary class="tool-call-summary">; the body (ToolCallInput, ToolCallOutput, ToolCallError) goes inside <div class="tool-call-content">. `status` (pending | running | done | error) sets data-status on the root, and aria-busy="true" only while running. The component never animates, times or opens itself: the consumer owns `open` (open it on error so ToolCallError is not hidden) and any spinner/animation CSS.
//
// Props: className, status, open (boolean, default false), onChange, summary (ReactNode),
// children (ReactNode, the body), ...restProps spread onto the root <details>.
// Keyboard: Enter / Space on the native <summary> toggles.

import React, { useEffect, useState } from "react";

export interface ToolCallProps {
    className?: string;
    /** pending | running | done | error. */
    status?: string;
    /** Whether open. */
    open?: boolean;
    /** Summary content (name + status words). */
    summary?: React.ReactNode;
    /** Body content. */
    children?: React.ReactNode;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function ToolCall({
    className = "",
    status = undefined,
    open: openProp = false,
    summary,
    onChange,
    children,
    ...restProps
}: ToolCallProps) {
    const [open, setOpen] = useState(openProp);
    useEffect(() => setOpen(openProp), [openProp]);

    return (
        <details
            className={`tool-call ${className}`}
            open={open}
            onToggle={(e) => {
                const next = (e.currentTarget as HTMLDetailsElement).open;
                if (next === open) return;
                setOpen(next);
                onChange?.(next);
            }}
            data-status={status}
            aria-busy={status === "running" ? "true" : undefined}
            {...restProps}
        >
            <summary className="tool-call-summary">{summary}</summary>
            <div className="tool-call-content">{children}</div>
        </details>
    );
}
