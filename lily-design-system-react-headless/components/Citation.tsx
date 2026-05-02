// Citation component
//
// A citation that acknowledges the relevance of another work.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <cite>.
//
// Accessibility:
//   - native <cite> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML cite element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite

import React from "react";

export interface CitationProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Citation({
    className = "",
    label = undefined,
    children,
    ...restProps
}: CitationProps) {
    return (
        <cite
            className={`citation ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </cite>
    );
}
