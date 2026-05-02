// Organization component
//
// An organization component containing organization-related information.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <article>.
//
// Accessibility:
//   - native <article> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML article element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article

import React from "react";

export interface OrganizationProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Organization({
    className = "",
    label = undefined,
    children,
    ...restProps
}: OrganizationProps) {
    return (
        <article
            className={`organization ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </article>
    );
}
