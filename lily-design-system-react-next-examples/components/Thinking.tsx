// Thinking component
//
// A headless collapsible block for a model's reasoning, built on native
// <details>/<summary>. Closed by default. While `streaming`, the root carries
// data-streaming and aria-busy.
//
// Props:
//   className -- string, optional. CSS class name.
//   label -- string, required. Summary text.
//   open -- boolean, default false. Bindable; supports onChange.
//   streaming -- boolean, default false.
//   children -- ReactNode. Reasoning content (inside .thinking-content).
//   ...restProps -- spread onto the root <details>.
//
// Keyboard: native summary (Enter / Space).

import React, { useEffect, useState } from "react";

export interface ThinkingProps {
    className?: string;
    /** Summary text. */
    label: string;
    /** Whether open. Bindable. */
    open?: boolean;
    /** Whether content is still being produced. */
    streaming?: boolean;
    /** Reasoning content. */
    children?: React.ReactNode;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function Thinking({
    className = "",
    label,
    open: openProp = false,
    streaming = false,
    onChange,
    children,
    ...restProps
}: ThinkingProps) {
    const [open, setOpen] = useState(openProp);
    useEffect(() => setOpen(openProp), [openProp]);

    return (
        <details
            className={`thinking ${className}`}
            open={open}
            onToggle={(e) => {
                const next = (e.currentTarget as HTMLDetailsElement).open;
                if (next === open) return;
                setOpen(next);
                onChange?.(next);
            }}
            data-streaming={streaming ? "true" : undefined}
            aria-busy={streaming ? "true" : undefined}
            {...restProps}
        >
            <summary className="thinking-summary">{label}</summary>
            <div className="thinking-content">{children}</div>
        </details>
    );
}
