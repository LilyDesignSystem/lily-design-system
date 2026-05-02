// Hero component
//
// A large box or image section with a title and description.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, required. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <section>.
//
// Accessibility:
//   - native <section> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML section element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section

import React from "react";

export interface HeroProps {
    className?: string;
    /** Accessible label set on aria-label. */
    label: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Hero({
    className = "",
    label,
    children,
    ...restProps
}: HeroProps) {
    return (
        <section
            className={`hero ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </section>
    );
}
