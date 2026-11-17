// Thinking component
//
// A headless collapsible block for a model's reasoning, built on native
// <details>/<summary>. Closed by default. While `streaming`, the root carries
// data-streaming and aria-busy.
//
// Props:
//   class -- string, optional. CSS class name.
//   label -- string, required. Summary text.
//   open -- boolean, default false. Bindable; supports onChange.
//   streaming -- boolean, default false.
//   children -- ReactNode. Reasoning content (inside .thinking-content).
//   ...restProps -- spread onto the root <details>.
//
// Keyboard: native summary (Enter / Space).

import type { JSX } from "@solidjs/web";
import { omit, createSignal } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { warnMissingName } from "./dev-warning";

export interface ThinkingProps {
    class?: string;
    /** Summary text. */
    label: string;
    /** Whether open. Bindable. */
    open?: boolean;
    /** Whether content is still being produced. */
    streaming?: boolean;
    /** Reasoning content. */
    children?: JSX.Element;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function Thinking(props: ThinkingProps) {
    const p = withDefaults({ class: "" as const, open: false, streaming: false }, props);
    const restProps = omit(p, "class", "label", "open", "streaming", "onChange", "children");
    warnMissingName("Thinking", p.label, p["aria-label"], p["aria-labelledby"]);
    const [open, setOpen] = createSignal(() => p.open);

    return (
        <details
            class={`thinking ${p.class}`}
            open={open()}
            onToggle={(e) => {
                const next = (e.currentTarget as HTMLDetailsElement).open;
                if (next === open()) return;
                setOpen(next);
                p.onChange?.(next);
            }}
            data-streaming={attr(p.streaming ? "true" : undefined)}
            aria-busy={attr(p.streaming ? "true" : undefined)}
            {...restProps}
        >
            <summary class="thinking-summary">{p.label}</summary>
            <div class="thinking-content">{p.children}</div>
        </details>
    );
}
