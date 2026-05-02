// AvatarGroup component
//
// A group of avatar components.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - native <div> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML div element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

import React from "react";

export interface AvatarGroupProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function AvatarGroup({
    className = "",
    label = undefined,
    children,
    ...restProps
}: AvatarGroupProps) {
    return (
        <div
            className={`avatar-group ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
