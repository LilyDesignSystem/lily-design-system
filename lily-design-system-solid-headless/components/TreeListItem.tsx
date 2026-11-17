// TreeListItem component
//
// One item in a tree navigation list.
//
// Props:
//   class — string, optional. CSS class name.
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

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
export interface TreeListItemProps {
    class?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Expanded state (controlled). Leave undefined for a leaf (no aria-expanded). */
    expanded?: boolean;
    /** Called with the new state when ArrowRight/ArrowLeft expands or collapses the item. */
    onExpandedChange?: (expanded: boolean) => void;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function TreeListItem(props: TreeListItemProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "expanded", "onExpandedChange", "children");
    // ArrowRight/ArrowLeft (WAI-ARIA tree pattern). Only for the focused item itself, not a
    // nested one the event bubbled up from. Swapped in right-to-left layouts.
    function handleKeyDown(event: KeyboardEvent & { currentTarget: HTMLLIElement }) {
        (
            restProps.onKeyDown as
                ((e: KeyboardEvent & { currentTarget: HTMLLIElement }) => void) | undefined
        )?.(event);
        const item = event.currentTarget;
        if (event.defaultPrevented || event.target !== item) return;
        const rtl = getComputedStyle(item).direction === "rtl";
        const open = rtl ? "ArrowLeft" : "ArrowRight";
        const close = rtl ? "ArrowRight" : "ArrowLeft";
        if (event.key === open) {
            if (p.expanded === false) {
                event.preventDefault();
                p.onExpandedChange?.(true);
            } else if (p.expanded === true) {
                const child = item.querySelector<HTMLElement>("[role='treeitem']");
                if (child) {
                    event.preventDefault();
                    child.focus();
                }
            }
        } else if (event.key === close) {
            if (p.expanded === true) {
                event.preventDefault();
                p.onExpandedChange?.(false);
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
            class={`tree-list-item ${p.class}`}
            role="treeitem"
            tabindex={-1}
            aria-label={p.label}
            aria-expanded={attr(p.expanded)}
            {...restProps}
            onKeyDown={handleKeyDown}
        >
            {p.children}
        </li>
    );
}
