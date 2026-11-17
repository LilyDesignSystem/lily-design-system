// ScrollerBase component
//
// A low-level scroll-position tracking primitive for scrollytelling. Renders
// a <div> whose direct children are treated as steps; reports the index of
// the currently active step (via IntersectionObserver) and the overall
// scroll progress (0 at the top of the scroller, 1 at the bottom) through
// optional callbacks.
//
// The trigger line for "active step" is positioned at `offset` * viewport
// height from the top of the viewport (0=top, 0.5=center, 1=bottom).
//
// Props:
//   class   — string, optional. CSS class name.
//   label       — string, optional. Accessible label for the scrollable region.
//   offset      — number, default 0.5. Trigger position within the viewport.
//   onIndexChange    — callback, optional. Called when the active step index changes.
//   onProgressChange — callback, optional. Called when the scroll progress changes.
//   children    — ReactNode, required. Step elements.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - aria-label exposes the scroll region (when label provided)
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Steps are the direct child elements; each gets observed

import type { JSX } from "@solidjs/web";
import { omit, createEffect, untrack } from "solid-js";
import { withDefaults } from "./defaults";
export interface ScrollerBaseProps {
    class?: string;
    /** Accessible label for the scroll region. */
    label?: string;
    /** Trigger position within the viewport (0=top, 0.5=center, 1=bottom). */
    offset?: number;
    /** Called when the active step index changes. */
    onIndexChange?: (index: number) => void;
    /** Called when the overall scroll progress (0..1) changes. */
    onProgressChange?: (progress: number) => void;
    /** Step elements. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function ScrollerBase(props: ScrollerBaseProps) {
    const p = withDefaults({ class: "" as const, offset: 0.5 }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "offset",
        "onIndexChange",
        "onProgressChange",
        "children",
    );
    const ref: { current: HTMLDivElement | null } = { current: null };

    createEffect(
        () => [p.offset, p.onIndexChange, p.onProgressChange],
        () =>
            untrack(() => {
                const root = ref.current;
                if (!root || typeof IntersectionObserver === "undefined") return;

                const steps = Array.from(root.children) as HTMLElement[];
                const triggerFromTop = `${(p.offset * 100).toFixed(2)}%`;

                const observer = new IntersectionObserver(
                    (entries) => {
                        for (const entry of entries) {
                            if (entry.isIntersecting) {
                                const idx = steps.indexOf(entry.target as HTMLElement);
                                if (idx !== -1) p.onIndexChange?.(idx);
                            }
                        }
                    },
                    {
                        rootMargin: `-${triggerFromTop} 0px -${(100 - p.offset * 100).toFixed(2)}% 0px`,
                        threshold: 0,
                    },
                );
                for (const step of steps) observer.observe(step);

                const onScroll = () => {
                    const rect = root.getBoundingClientRect();
                    const winH = window.innerHeight || 1;
                    const total = rect.height + winH;
                    const passed = winH - rect.top;
                    const progress = Math.max(0, Math.min(1, passed / total));
                    p.onProgressChange?.(progress);
                };
                window.addEventListener("scroll", onScroll, { passive: true });
                onScroll();

                return () => {
                    observer.disconnect();
                    window.removeEventListener("scroll", onScroll);
                };
            }),
    );

    return (
        <div
            ref={(el) => (ref.current = el)}
            class={`scroller-base ${p.class}`}
            role={p.label ? "group" : undefined}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
