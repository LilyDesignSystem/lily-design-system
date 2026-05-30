// Answer component
//
// An answer is anything that responds to a question, request, action, etc.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import React from "react";

export interface AnswerProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Answer({
    className = "",
    label = undefined,
    children,
    ...restProps
}: AnswerProps) {
    return (
        <div
            className={`answer ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
