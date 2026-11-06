// Cascader component
//
// A multi-level dropdown for selecting a value from a hierarchy. The
// component is a `role="combobox"` container with a trigger button and a
// panel that holds nested option lists supplied by the consumer.
//
// Props:
//   className    — string, optional. CSS class name.
//   label        — string, REQUIRED. aria-label for the combobox.
//   expanded     — boolean, default false. Whether the panel is open.
//   disabled     — boolean, default false. Disables the trigger button.
//   placeholder  — string, optional. Placeholder shown on the trigger when no value.
//   value        — string, optional. Display value on the trigger.
//   onClick      — (event: React.MouseEvent) => void, optional. Trigger click handler.
//   children     — ReactNode, required. Panel content (typically nested option lists).
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <Cascader label="Region" expanded={open} value={selected} onClick={toggle}>
//     <ul>…</ul>
//   </Cascader>
//
// Examples:
//
//   <Cascader label="Region" placeholder="Select…" expanded={false}>
//     <ul role="tree">…</ul>
//   </Cascader>
//
// Keyboard:
//   - Tab: focus the trigger
//   - Enter / Space on trigger: opens the panel (consumer toggles `expanded`)
//
// Accessibility:
//   - role="combobox", aria-haspopup="tree", aria-expanded, aria-label
//
// Internationalization:
//   - label, placeholder, value are all consumer-supplied
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label is non-optional in the interface
//
// References:
//   - Ant Design Cascader: https://ant.design/components/cascader

import React from "react";
import { attachTreePopup, type TreeSelection } from "./widget-keys";
import { usePopoverState } from "./Popover";

export interface CascaderProps {
    className?: string;
    /** aria-label for the combobox (required) */
    label: string;
    /** Whether the panel is open */
    expanded?: boolean;
    /** Called when the keys or the trigger open or close it. */
    onExpandedChange?: (open: boolean) => void;
    /** Called with the chosen item, its path and every selected value. */
    onSelect?: (selection: TreeSelection) => void;
    /** Whether the trigger is disabled */
    disabled?: boolean;
    /** Placeholder shown on the trigger when no value */
    placeholder?: string;
    /** Display value on the trigger */
    value?: string;
    /** Trigger click handler */
    onClick?: (event: React.MouseEvent) => void;
    /** Panel content (typically nested option lists) */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Cascader({
    className = "",
    label,
    expanded = false,
    onExpandedChange = undefined,
    onSelect = undefined,
    disabled = false,
    placeholder = undefined,
    value = undefined,
    onClick = undefined,
    children,
    ...restProps
}: CascaderProps) {
    const panelRef = React.useRef<HTMLDivElement>(null);
    usePopoverState(panelRef, expanded);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const latest = React.useRef({ onExpandedChange, onSelect });
    latest.current = { onExpandedChange, onSelect };
    React.useEffect(
        () =>
            attachTreePopup(rootRef.current!, {
                exclusive: true,
                onOpen: (open) => latest.current.onExpandedChange?.(open),
                onSelect: (selection) => latest.current.onSelect?.(selection),
            }),
        [],
    );

    return (
        <div
            ref={rootRef}
            className={`cascader ${className}`}
            {...restProps}
        >
            <button
                className="cascader-trigger"
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
                className="cascader-panel"
                ref={panelRef}
                popover="manual"
            >
                {children}
            </div>
        </div>
    );
}
