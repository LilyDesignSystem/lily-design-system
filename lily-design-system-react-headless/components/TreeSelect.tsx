// TreeSelect component
//
// A select dropdown showing a tree of hierarchical options. The component
// is a `role="combobox"` container with a trigger button and a panel that
// holds the tree (typically supplied as TreeNav/TreeList).
//
// Props:
//   className    — string, optional. CSS class name.
//   label        — string, REQUIRED. aria-label.
//   expanded     — boolean, default false. Whether the tree panel is open.
//   disabled     — boolean, default false.
//   multiple     — boolean, default false. Sets data-multiple on container.
//   placeholder  — string, optional.
//   value        — string, optional. Display value on the trigger.
//   onClick      — (event: React.MouseEvent) => void, optional. Trigger click handler.
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

import React from "react";
import { attachTreePopup, type TreeSelection } from "./widget-keys";
import { usePopoverState } from "./Popover";

export interface TreeSelectProps {
    className?: string;
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
    onClick?: (event: React.MouseEvent) => void;
    /** Tree content (typically TreeNav or TreeList) */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function TreeSelect({
    className = "",
    label,
    expanded = false,
    onExpandedChange = undefined,
    onSelect = undefined,
    disabled = false,
    multiple = false,
    placeholder = undefined,
    value = undefined,
    onClick = undefined,
    children,
    ...restProps
}: TreeSelectProps) {
    const panelRef = React.useRef<HTMLDivElement>(null);
    usePopoverState(panelRef, expanded);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const latest = React.useRef({ onExpandedChange, onSelect });
    latest.current = { onExpandedChange, onSelect };
    React.useEffect(
        () =>
            attachTreePopup(rootRef.current!, {
                onOpen: (open) => latest.current.onExpandedChange?.(open),
                onSelect: (selection) => latest.current.onSelect?.(selection),
            }),
        [],
    );

    return (
        <div
            ref={rootRef}
            className={`tree-select ${className}`}
            data-multiple={multiple ? true : undefined}
            {...restProps}
        >
            <button
                className="tree-select-trigger"
                type="button"
                role="combobox"
                aria-haspopup="tree"
                aria-expanded={expanded}
                aria-label={label}
                disabled={disabled}
                onClick={onClick}
            >
                {value || placeholder}
            </button>
            <div
                className="tree-select-panel"
                ref={panelRef}
                popover="manual"
            >
                {children}
            </div>
        </div>
    );
}
