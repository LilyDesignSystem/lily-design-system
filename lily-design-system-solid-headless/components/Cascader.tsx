// Cascader component
//
// A multi-level dropdown for selecting a value from a hierarchy. The
// component is a `role="combobox"` container with a trigger button and a
// panel that holds nested option lists supplied by the consumer.
//
// Props:
//   class    — string, optional. CSS class name.
//   label        — string, REQUIRED. aria-label for the combobox.
//   expanded     — boolean, default false. Whether the panel is open.
//   disabled     — boolean, default false. Disables the trigger button.
//   placeholder  — string, optional. Placeholder shown on the trigger when no value.
//   value        — string, optional. Display value on the trigger.
//   onClick      — (event: MouseEvent) => void, optional. Trigger click handler.
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

import type { JSX } from "@solidjs/web";
import { merge, omit, onSettled, untrack } from "solid-js";
import { attr } from "./attr";
import { attachTreePopup, type TreeSelection } from "./widget-keys";
import { usePopoverState } from "./Popover";

export interface CascaderProps {
    class?: string;
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
    onClick?: (event: MouseEvent) => void;
    /** Panel content (typically nested option lists) */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Cascader(props: CascaderProps) {
    const p = merge({ class: "" as const, expanded: false, disabled: false }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "expanded",
        "onExpandedChange",
        "onSelect",
        "disabled",
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
                exclusive: true,
                onOpen: (open) => latest.current.onExpandedChange?.(open),
                onSelect: (selection) => latest.current.onSelect?.(selection),
            }),
        ),
    );

    return (
        <div
            ref={(el) => (rootRef.current = el)}
            class={`cascader ${p.class}`}
            {...restProps}
        >
            <button
                class="cascader-trigger"
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
                class="cascader-panel"
                ref={(el) => (panelRef.current = el)}
                popover="manual"
            >
                {p.children}
            </div>
        </div>
    );
}
