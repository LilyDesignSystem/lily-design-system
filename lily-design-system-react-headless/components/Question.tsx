// Question component
//
// A question is anything that asks for information, invites a response, tests knowledge, etc.
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

export interface QuestionProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Question({
    className = "",
    label = undefined,
    children,
    ...restProps
}: QuestionProps) {
    return (
        <div
            className={`question ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
