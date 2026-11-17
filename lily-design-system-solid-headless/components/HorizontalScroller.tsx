// HorizontalScroller component
//
// A horizontally scrollable region. Renders a <div role="region"> with
// tabindex=0 so keyboard users can focus the area, and handles ArrowLeft /
// ArrowRight to scroll horizontally inside it. Pointer / touch scrolling
// is left to the browser's native overflow behaviour (which the consumer
// enables via overflow-x: auto in CSS).
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, required. Accessible label for the scrollable region.
//   step     — number, default 100. Pixels to scroll per Arrow key press.
//   children — ReactNode, required. Horizontally arranged content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - role="region" + aria-label exposes the area as a labelled landmark
//   - tabindex=0 makes the scroll container focusable for keyboard users
//   - Arrow keys scroll horizontally for users who can't drag
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//     (overflow-x: auto + a flex/inline-flex track inside)

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface HorizontalScrollerProps {
    class?: string;
    /** Accessible label for the scrollable region. */
    label: string;
    /** Pixels to scroll per Arrow key press. */
    step?: number;
    /** Horizontally arranged content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function HorizontalScroller(props: HorizontalScrollerProps) {
    const p = withDefaults({ class: "" as const, step: 100 }, props);
    const restProps = omit(p, "class", "label", "step", "children");
    warnMissingName("HorizontalScroller", p.label, p["aria-label"], p["aria-labelledby"]);
    const ref: { current: HTMLDivElement | null } = { current: null };

    const handleKeyDown = (event: KeyboardEvent & { currentTarget: HTMLDivElement }) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            ref.current?.scrollBy({ left: p.step, behavior: "smooth" });
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            ref.current?.scrollBy({ left: -p.step, behavior: "smooth" });
        } else if (event.key === "Home") {
            event.preventDefault();
            ref.current?.scrollTo({ left: 0, behavior: "smooth" });
        } else if (event.key === "End") {
            event.preventDefault();
            const el = ref.current;
            if (el)
                el.scrollTo({
                    left:
                        getComputedStyle(el).direction === "rtl" ? -el.scrollWidth : el.scrollWidth,
                    behavior: "smooth",
                });
        }
    };

    return (
        <div
            ref={(el) => (ref.current = el)}
            class={`horizontal-scroller ${p.class}`}
            role="region"
            aria-label={p.label}
            tabindex={0}
            onKeyDown={handleKeyDown}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
