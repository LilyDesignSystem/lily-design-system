// TreeMenu component
//
// A hierarchical tree menu with expandable branches.
//
// Props:
//   class — string, optional. CSS class name.
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

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface TreeMenuProps {
    class?: string;
    /** Accessible label set on aria-label. */
    label: string;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

const TREE_KEYS = ["ArrowDown", "ArrowUp", "Home", "End"];

export default function TreeMenu(props: TreeMenuProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    warnMissingName("TreeMenu", p.label, p["aria-label"], p["aria-labelledby"]);
    // ArrowDown / ArrowUp move between the consumer's [role="treeitem"] items, wrapping; Home / End jump.
    function handleKeyDown(event: KeyboardEvent & { currentTarget: HTMLUListElement }) {
        (
            restProps.onKeyDown as
                ((e: KeyboardEvent & { currentTarget: HTMLUListElement }) => void) | undefined
        )?.(event);
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
        <ul
            class={`tree-menu ${p.class}`}
            role="tree"
            aria-label={p.label}
            tabindex={-1}
            {...restProps}
            onKeyDown={handleKeyDown}
        >
            {p.children}
        </ul>
    );
}
