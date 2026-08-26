// Place component
//
// A place component containing place-related information.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <article>.
//
// Accessibility:
//   - native <article> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML article element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article

import React from "react";

export interface PlaceProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Place({
    className = "",
    label = undefined,
    children,
    ...restProps
}: PlaceProps) {
    return (
        <article
            className={`place ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </article>
    );
}
