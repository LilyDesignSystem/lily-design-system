// Kbd component
//
// An inline element for keyboard shortcuts and key combinations.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <kbd>.
//
// Accessibility:
//   - native <kbd> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML kbd element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd

import React from "react";

export interface KbdProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Kbd({
    className = "",
    label = undefined,
    children,
    ...restProps
}: KbdProps) {
    return (
        <kbd
            className={`kbd ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </kbd>
    );
}
