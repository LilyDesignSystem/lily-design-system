// HorizontalScroller component
//
// A horizontally scrollable region. Renders a <div role="region"> with
// tabindex=0 so keyboard users can focus the area, and handles ArrowLeft /
// ArrowRight to scroll horizontally inside it. Pointer / touch scrolling
// is left to the browser's native overflow behaviour (which the consumer
// enables via overflow-x: auto in CSS).
//
// Props:
//   className — string, optional. CSS class name.
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

import React, { useRef } from "react";

export interface HorizontalScrollerProps {
    className?: string;
    /** Accessible label for the scrollable region. */
    label: string;
    /** Pixels to scroll per Arrow key press. */
    step?: number;
    /** Horizontally arranged content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function HorizontalScroller({
    className = "",
    label,
    step = 100,
    children,
    ...restProps
}: HorizontalScrollerProps) {
    const ref = useRef<HTMLDivElement>(null);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            ref.current?.scrollBy({ left: step, behavior: "smooth" });
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            ref.current?.scrollBy({ left: -step, behavior: "smooth" });
        } else if (event.key === "Home") {
            event.preventDefault();
            ref.current?.scrollTo({ left: 0, behavior: "smooth" });
        } else if (event.key === "End") {
            event.preventDefault();
            const el = ref.current;
            if (el) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
        }
    };

    return (
        <div
            ref={ref}
            className={`horizontal-scroller ${className}`}
            role="region"
            aria-label={label}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            {...restProps}
        >
            {children}
        </div>
    );
}
