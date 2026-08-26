// ChatList component
//
// An ordered list of chat list items.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <ol>.
//
// Accessibility:
//   - native <ol> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML ol element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol

import React from "react";

export interface ChatListProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function ChatList({
    className = "",
    label = undefined,
    children,
    ...restProps
}: ChatListProps) {
    return (
        <ol
            className={`chat-list ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </ol>
    );
}
