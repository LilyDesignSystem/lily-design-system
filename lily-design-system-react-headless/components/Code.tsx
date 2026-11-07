// Code component
//
// An inline code span for short code snippets within surrounding text.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <code>.
//
// Accessibility:
//   - native <code> semantics
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML code element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code

import React from "react";

export interface CodeProps {
    className?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Code({ className = "", children, ...restProps }: CodeProps) {
    return (
        <code
            className={`code ${className}`}
            {...restProps}
        >
            {children}
        </code>
    );
}
