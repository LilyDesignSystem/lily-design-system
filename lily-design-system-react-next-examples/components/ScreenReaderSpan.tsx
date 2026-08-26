// ScreenReaderSpan component
//
// A visually hidden span of text intended for screen readers.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Accessibility:
//   - native <span> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML span element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span

import React from "react";

export interface ScreenReaderSpanProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function ScreenReaderSpan({
    className = "",
    label = undefined,
    children,
    ...restProps
}: ScreenReaderSpanProps) {
    return (
        <span
            className={`screen-reader-span ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </span>
    );
}
