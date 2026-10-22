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
    /** Expanded state (controlled). Leave undefined for a leaf (no aria-expanded). */
    expanded?: boolean;
    /** Called with the new state when ArrowRight/ArrowLeft expands or collapses the item. */
    onExpandedChange?: (expanded: boolean) => void;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function TreeListItem({
    className = "",
    label = undefined,
    expanded = undefined,
    onExpandedChange = undefined,
    children,
    ...restProps
}: TreeListItemProps) {
    // ArrowRight/ArrowLeft (WAI-ARIA tree pattern). Only for the focused item itself, not a
    // nested one the event bubbled up from. Swapped in right-to-left layouts.
    function handleKeyDown(event: React.KeyboardEvent<HTMLLIElement>) {
        (restProps.onKeyDown as ((e: React.KeyboardEvent<HTMLLIElement>) => void) | undefined)?.(event);
        const item = event.currentTarget;
        if (event.defaultPrevented || event.target !== item) return;
        const rtl = getComputedStyle(item).direction === "rtl";
        const open = rtl ? "ArrowLeft" : "ArrowRight";
        const close = rtl ? "ArrowRight" : "ArrowLeft";
        if (event.key === open) {
            if (expanded === false) {
                event.preventDefault();
                onExpandedChange?.(true);
            } else if (expanded === true) {
                const child = item.querySelector<HTMLElement>("[role='treeitem']");
                if (child) {
                    event.preventDefault();
                    child.focus();
                }
            }
        } else if (event.key === close) {
            if (expanded === true) {
                event.preventDefault();
                onExpandedChange?.(false);
            } else {
                const parent = item.parentElement?.closest<HTMLElement>("[role='treeitem']");
                if (parent) {
                    event.preventDefault();
                    parent.focus();
                }
            }
        }
    }

    return (
        <li
            className={`tree-list-item ${className}`}
            role="treeitem"
            tabIndex={-1}
            aria-label={label}
            aria-expanded={expanded}
            {...restProps}
            onKeyDown={handleKeyDown}
        >
            {children}
        </li>
    );
}
