// EmptyState component
//
// A headless container for "nothing here yet" content. Heading, text and
// actions are supplied by the consumer as children; no icon is bundled.
//
// Props:
//   class -- string, optional. CSS class name.
//   label -- string, optional. When given: role="group" + aria-label.
//   children -- ReactNode. Consumer content.
//   ...restProps -- spread onto the root <div>.
//
// Accessibility: not a live region; role="group" only when labelled.

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface EmptyStateProps {
    class?: string;
    /** Optional accessible label; adds role="group". */
    label?: string;
    /** Consumer content. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function EmptyState(props: EmptyStateProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`empty-state ${p.class}`}
            role={p.label ? "group" : undefined}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
