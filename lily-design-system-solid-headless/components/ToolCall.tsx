// ToolCall component
//
// A headless disclosure for one tool invocation, built on the native <details>. Closed by default. The `summary` content (typically ToolCallName and ToolCallStatus) goes inside <summary class="tool-call-summary">; the body (ToolCallInput, ToolCallOutput, ToolCallError) goes inside <div class="tool-call-content">. `status` (pending | running | done | error) sets data-status on the root, and aria-busy="true" only while running. The component never animates, times or opens itself: the consumer owns `open` (open it on error so ToolCallError is not hidden) and any spinner/animation CSS.
//
// Props: class, status, open (boolean, default false), onChange, summary (ReactNode),
// children (ReactNode, the body), ...restProps spread onto the root <details>.
// Keyboard: Enter / Space on the native <summary> toggles.

import type { JSX } from "@solidjs/web";
import { merge, omit, createSignal } from "solid-js";
import { attr } from "./attr";
export interface ToolCallProps {
    class?: string;
    /** pending | running | done | error. */
    status?: string;
    /** Whether open. */
    open?: boolean;
    /** Summary content (name + status words). */
    summary?: JSX.Element;
    /** Body content. */
    children?: JSX.Element;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function ToolCall(props: ToolCallProps) {
    const p = merge({ class: "" as const, open: false }, props);
    const restProps = omit(p, "class", "status", "open", "summary", "onChange", "children");
    const [open, setOpen] = createSignal(() => p.open);

    return (
        <details
            class={`tool-call ${p.class}`}
            open={open()}
            onToggle={(e) => {
                const next = (e.currentTarget as HTMLDetailsElement).open;
                if (next === open()) return;
                setOpen(next);
                p.onChange?.(next);
            }}
            data-status={attr(p.status)}
            aria-busy={attr(p.status === "running" ? "true" : undefined)}
            {...restProps}
        >
            <summary class="tool-call-summary">{p.summary}</summary>
            <div class="tool-call-content">{p.children}</div>
        </details>
    );
}
