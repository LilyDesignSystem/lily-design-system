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
import { warnMissingName } from "./dev-warning";

export interface TreeMenuProps {
    className?: string;
    /** Accessible label set on aria-label. */
    label: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

const TREE_KEYS = ["ArrowDown", "ArrowUp", "Home", "End"];

export default function TreeMenu({ className = "", label, children, ...restProps }: TreeMenuProps) {
    warnMissingName("TreeMenu", label, restProps["aria-label"], restProps["aria-labelledby"]);
    // ArrowDown / ArrowUp move between the consumer's [role="treeitem"] items, wrapping; Home / End jump.
    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        (restProps.onKeyDown as ((e: React.KeyboardEvent<HTMLDivElement>) => void) | undefined)?.(
            event,
        );
        if (event.defaultPrevented || !TREE_KEYS.includes(event.key)) return;
        const items = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>('[role="treeitem"]'),
        );
        if (items.length === 0) return;
        const current = items.indexOf(
            (event.target as Element).closest('[role="treeitem"]') as HTMLElement,
        );
        const last = items.length - 1;
        const next =
            event.key === "Home"
                ? 0
                : event.key === "End"
                  ? last
                  : event.key === "ArrowDown"
                    ? current >= last
                        ? 0
                        : current + 1
                    : current <= 0
                      ? last
                      : current - 1;
        event.preventDefault();
        items[next].focus();
    }

    return (
        <div
            className={`tree-menu ${className}`}
            role="tree"
            aria-label={label}
            tabIndex={-1}
            {...restProps}
            onKeyDown={handleKeyDown}
        >
            {children}
        </div>
    );
}
