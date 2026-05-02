// ChatNav component
//
// A navigation container for chat information.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, required. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <nav>.
//
// Accessibility:
//   - native <nav> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav

import React from "react";

export interface ChatNavProps {
    className?: string;
    /** Accessible label set on aria-label. */
    label: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function ChatNav({
    className = "",
    label,
    children,
    ...restProps
}: ChatNavProps) {
    return (
        <nav
            className={`chat-nav ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </nav>
    );
}
