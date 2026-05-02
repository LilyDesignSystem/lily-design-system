// DialGroup component
//
// A labelled group container for one or more Dial components. Renders a
// <div role="group"> with the kebab class so screen readers announce the
// dials as a related set.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, required. Accessible label for the group.
//   children — ReactNode, required. Dial components.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - role="group" + aria-label labels the dial group
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

import React from "react";

export interface DialGroupProps {
    className?: string;
    /** Accessible label for the dial group. */
    label: string;
    /** Dial components. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function DialGroup({
    className = "",
    label,
    children,
    ...restProps
}: DialGroupProps) {
    return (
        <div
            className={`dial-group ${className}`}
            role="group"
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
