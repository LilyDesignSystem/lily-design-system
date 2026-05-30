// Comment component
//
// A comment is anything that expresses an opinion, observation, explanation, etc.
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

export interface CommentProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Comment({
    className = "",
    label = undefined,
    children,
    ...restProps
}: CommentProps) {
    return (
        <div
            className={`comment ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
