// Kbd component
//
// An inline element for keyboard shortcuts and key combinations.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, optional. Spoken form, read instead of the visible key.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <kbd>.
//
// Accessibility:
//   - native <kbd> semantics
//   - hidden text comes from `label` when given
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML kbd element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd

import React from "react";

export interface KbdProps {
    className?: string;
    /** Spoken form, read instead of the visible key. */
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
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            <span
                className="kbd-text"
                aria-hidden={label ? "true" : undefined}
            >
                {children}
            </span>
        </kbd>
    );
}
