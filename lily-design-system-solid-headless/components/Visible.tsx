// Visible component
//
// An IntersectionObserver wrapper that exposes the element's viewport
// visibility state to the consumer through a render-prop child. Use it for
// lazy work that should only happen when an element is actually on screen
// (lazy-mounting heavy charts, deferring videos, kicking off animations).
//
// The children prop is a function that receives the current visibility
// boolean and returns the content to render. Optional `once` mode stops
// observing after the first intersection — useful for one-shot reveal
// animations or "load when seen" patterns.
//
// Props:
//   class  — string, optional. CSS class name.
//   once       — boolean, default false. Stop observing after first intersection.
//   threshold  — number, default 0. IntersectionObserver threshold (0..1).
//   rootMargin — string, default "0px". IntersectionObserver rootMargin.
//   children   — (visible: boolean) => ReactNode, required.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import type { JSX } from "@solidjs/web";
import { omit, createEffect, createSignal, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface VisibleProps {
    class?: string;
    /** Stop observing after the first intersection. */
    once?: boolean;
    /** IntersectionObserver threshold. */
    threshold?: number;
    /** IntersectionObserver rootMargin. */
    rootMargin?: string;
    /** Render-prop child receiving the visibility boolean. */
    children: (visible: boolean) => JSX.Element;
    [key: string]: unknown;
}

export default function Visible(props: VisibleProps) {
    const p = withDefaults(
        { class: "" as const, once: false, threshold: 0, rootMargin: "0px" as const },
        props,
    );
    const restProps = omit(p, "class", "once", "threshold", "rootMargin", "children");
    const ref: { current: HTMLDivElement | null } = { current: null };
    const [visible, setVisible] = createSignal(false);

    createEffect(
        () => [p.once, p.threshold, p.rootMargin],
        () =>
            untrack(() => {
                const el = ref.current;
                if (!el || typeof IntersectionObserver === "undefined") return;
                const observer = new IntersectionObserver(
                    (entries) => {
                        for (const entry of entries) {
                            if (entry.target === el) {
                                setVisible(entry.isIntersecting);
                                if (p.once && entry.isIntersecting) {
                                    observer.disconnect();
                                }
                            }
                        }
                    },
                    { threshold: p.threshold, rootMargin: p.rootMargin },
                );
                observer.observe(el);
                return () => observer.disconnect();
            }),
    );

    return (
        <div
            ref={(el) => (ref.current = el)}
            class={`visible ${p.class}`}
            data-visible={attr(visible())}
            {...restProps}
        >
            {p.children(visible())}
        </div>
    );
}
