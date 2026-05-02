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
//   className  — string, optional. CSS class name.
//   once       — boolean, default false. Stop observing after first intersection.
//   threshold  — number, default 0. IntersectionObserver threshold (0..1).
//   rootMargin — string, default "0px". IntersectionObserver rootMargin.
//   children   — (visible: boolean) => ReactNode, required.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import React, { useEffect, useRef, useState } from "react";

export interface VisibleProps {
    className?: string;
    /** Stop observing after the first intersection. */
    once?: boolean;
    /** IntersectionObserver threshold. */
    threshold?: number;
    /** IntersectionObserver rootMargin. */
    rootMargin?: string;
    /** Render-prop child receiving the visibility boolean. */
    children: (visible: boolean) => React.ReactNode;
    [key: string]: unknown;
}

export default function Visible({
    className = "",
    once = false,
    threshold = 0,
    rootMargin = "0px",
    children,
    ...restProps
}: VisibleProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === "undefined") return;
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.target === el) {
                        setVisible(entry.isIntersecting);
                        if (once && entry.isIntersecting) {
                            observer.disconnect();
                        }
                    }
                }
            },
            { threshold, rootMargin }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [once, threshold, rootMargin]);

    return (
        <div
            ref={ref}
            className={`visible ${className}`}
            data-visible={visible}
            {...restProps}
        >
            {children(visible)}
        </div>
    );
}
