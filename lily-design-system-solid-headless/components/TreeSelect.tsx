// TreeSelect component
//
// A select dropdown showing a tree of hierarchical options. The component
// is a `role="combobox"` container with a trigger button and a panel that
// holds the tree (typically supplied as TreeNav/TreeList).
//
// Props:
//   class    — string, optional. CSS class name.
//   label        — string, REQUIRED. aria-label.
//   expanded     — boolean, default false. Whether the tree panel is open.
//   disabled     — boolean, default false.
//   multiple     — boolean, default false. Sets data-multiple on container.
//   placeholder  — string, optional.
//   value        — string, optional. Display value on the trigger.
//   onClick      — (event: MouseEvent) => void, optional. Trigger click handler.
//   children     — ReactNode, required. Tree content.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <TreeSelect label="Category" expanded={open} value={selected} onClick={toggle}>
//     <TreeNav>…</TreeNav>
//   </TreeSelect>
//
// Accessibility:
//   - role="combobox", aria-haspopup="tree", aria-expanded, aria-label
//   - data-multiple when `multiple` (aria-multiselectable is invalid on a combobox)
//
// Internationalization:
//   - All user-facing strings (label, placeholder, value) are consumer-supplied.
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label is non-optional in the interface
//
// References:
//   - Ant Design TreeSelect: https://ant.design/components/tree-select

import type { JSX } from "@solidjs/web";
import { omit, onSettled, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { attachTreePopup, type TreeSelection } from "./widget-keys";
import { usePopoverState } from "./Popover";

export interface TreeSelectProps {
    class?: string;
    /** aria-label for the combobox (required) */
    label: string;
    /** Whether the tree panel is open */
    expanded?: boolean;
    /** Called when the keys or the trigger open or close it. */
    onExpandedChange?: (open: boolean) => void;
    /** Called with the chosen item, its path and every selected value. */
    onSelect?: (selection: TreeSelection) => void;
    /** Whether the trigger is disabled */
    disabled?: boolean;
    /** Whether multiple selection is allowed */
    multiple?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** Display value on the trigger */
    value?: string;
    /** Trigger click handler */
    onClick?: (event: MouseEvent) => void;
    /** Tree content (typically TreeNav or TreeList) */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function TreeSelect(props: TreeSelectProps) {
    const p = withDefaults(
        { class: "" as const, expanded: false, disabled: false, multiple: false },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "expanded",
        "onExpandedChange",
        "onSelect",
        "disabled",
        "multiple",
        "placeholder",
        "value",
        "onClick",
        "children",
    );
    const panelRef: { current: HTMLDivElement | null } = { current: null };
    usePopoverState(panelRef, () => p.expanded);
    const rootRef: { current: HTMLDivElement | null } = { current: null };
    // The latest props, read live: a Solid component body runs once.
    const latest = {
        get current() {
            return { onExpandedChange: p.onExpandedChange, onSelect: p.onSelect };
        },
    };
    onSettled(() =>
        untrack(() =>
            attachTreePopup(rootRef.current!, {
                onOpen: (open) => latest.current.onExpandedChange?.(open),
                onSelect: (selection) => latest.current.onSelect?.(selection),
            }),
        ),
    );

    return (
        <div
            ref={(el) => (rootRef.current = el)}
            class={`tree-select ${p.class}`}
            data-multiple={attr(p.multiple ? true : undefined)}
            {...restProps}
        >
            <button
                class="tree-select-trigger"
                type="button"
                role="combobox"
                aria-haspopup="tree"
                aria-expanded={attr(p.expanded)}
                aria-label={p.label}
                disabled={p.disabled}
                onClick={p.onClick}
            >
                {p.value || p.placeholder}
            </button>
            <div
                class="tree-select-panel"
                ref={(el) => (panelRef.current = el)}
                popover="manual"
            >
                {p.children}
            </div>
        </div>
    );
}
