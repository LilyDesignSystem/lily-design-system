// TreeListItem component
//
// One item in a tree navigation list.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Accessibility:
//   - role='treeitem' on the wrapper
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li

import React from "react";

export interface TreeListItemProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function TreeListItem({
    className = "",
    label = undefined,
    children,
    ...restProps
}: TreeListItemProps) {
    return (
        <li
            className={`tree-list-item ${className}`}
            role="treeitem"
            aria-label={label}
            {...restProps}
        >
            {children}
        </li>
    );
}
