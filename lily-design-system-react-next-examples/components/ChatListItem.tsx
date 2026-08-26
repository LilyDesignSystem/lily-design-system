// ChatListItem component
//
// One chat list item, typically containing a chat message.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Accessibility:
//   - native <li> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li

import React from "react";

export interface ChatListItemProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function ChatListItem({
    className = "",
    label = undefined,
    children,
    ...restProps
}: ChatListItemProps) {
    return (
        <li
            className={`chat-list-item ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </li>
    );
}
