// Scroller component
//
// A scrollytelling container with a sticky `background` that updates as the
// foreground steps scroll past. Built on top of ScrollerBase: each direct
// child of the foreground area is a step that drives the active index, and
// the consumer renders different background content based on that index.
//
// The component renders three regions inside the wrapper:
//   .scroller-background — sticky; consumer styles position: sticky in CSS
//   .scroller-foreground — the column containing scrollable step children
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, optional. Accessible label for the scroller region.
//   offset   — number, default 0.5. Step trigger position in the viewport.
//   onIndexChange    — callback, optional. Fired when active step changes.
//   onProgressChange — callback, optional. Fired with overall progress 0..1.
//   children — ReactNode, required. Foreground step content.
//   background — ReactNode, required. Sticky background that changes with steps.
//   ...restProps — additional HTML attributes spread onto the wrapper <div>.
//
// Accessibility:
//   - aria-label on the wrapper (when label provided)
//   - aria-live="polite" on the background so screen readers are notified
//     when the background visualisation changes
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Position: sticky on the background is the consumer's CSS responsibility

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import ScrollerBase from "./ScrollerBase";

export interface ScrollerProps {
    class?: string;
    /** Accessible label for the scroller region. */
    label?: string;
    /** Step trigger position in the viewport (0..1). */
    offset?: number;
    /** Fired when the active step index changes. */
    onIndexChange?: (index: number) => void;
    /** Fired with overall scroll progress (0..1). */
    onProgressChange?: (progress: number) => void;
    /** Foreground step content. */
    children: JSX.Element;
    /** Sticky background content that changes with the active step. */
    background: JSX.Element;
    [key: string]: unknown;
}

export default function Scroller(props: ScrollerProps) {
    const p = withDefaults({ class: "" as const, offset: 0.5 }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "offset",
        "onIndexChange",
        "onProgressChange",
        "children",
        "background",
    );
    return (
        <div
            class={`scroller ${p.class}`}
            role={p.label ? "group" : undefined}
            aria-label={p.label}
            {...restProps}
        >
            <div
                class="scroller-background"
                aria-live="polite"
            >
                {p.background}
            </div>
            <ScrollerBase
                class="scroller-foreground"
                offset={p.offset}
                onIndexChange={p.onIndexChange}
                onProgressChange={p.onProgressChange}
            >
                {p.children}
            </ScrollerBase>
        </div>
    );
}
