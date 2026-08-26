// CodeBlock component
//
// A block of formatted code with optional line numbers and line highlighting.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <pre>.
//
// Accessibility:
//   - native <pre> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML pre element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre

import React from "react";

export interface CodeBlockProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function CodeBlock({
    className = "",
    label = undefined,
    children,
    ...restProps
}: CodeBlockProps) {
    return (
        <pre
            className={`code-block ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </pre>
    );
}
