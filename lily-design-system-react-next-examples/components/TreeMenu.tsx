// TreeMenu component
//
// A hierarchical tree menu with expandable branches.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, required. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - role='tree' on the wrapper
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML div element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

import React from "react";

export interface TreeMenuProps {
    className?: string;
    /** Accessible label set on aria-label. */
    label: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function TreeMenu({
    className = "",
    label,
    children,
    ...restProps
}: TreeMenuProps) {
    return (
        <div
            className={`tree-menu ${className}`}
            role="tree"
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
