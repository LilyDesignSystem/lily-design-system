// ActionGroup component
//
// A group of action buttons that can collapse to an overflow menu when
// space is constrained. The visible action buttons are passed via
// `children`; the overflow menu content is passed via the `overflow`
// prop (NOT children). Inspired by Adobe Spectrum.
//
// Props:
//   class         — string, optional. CSS class name.
//   label             — string, REQUIRED. aria-label for the group.
//   overflowOpen      — boolean, default false. Whether the overflow menu is open.
//   overflowLabel     — string, optional. aria-label for the overflow trigger button.
//   onOverflowToggle  — overflow trigger click handler.
//   children          — ReactNode, optional. The visible action buttons.
//   overflow          — ReactNode, optional. Content for the overflow menu.
//   ...restProps      — additional HTML attributes spread onto the root <div>.
//
// Behavior:
//   The overflow trigger and overflow menu only render when `overflow` is provided.
//
// Headless rules:
//   - No CSS, no inline styles
//   - All user-facing strings are consumer-supplied (i18n)
//
// References:
//   - Adobe Spectrum ActionGroup: https://spectrum.adobe.com/page/action-group/

import type { JSX } from "@solidjs/web";
import { merge, omit, createSignal, createUniqueId, onSettled, untrack } from "solid-js";
import { attr } from "./attr";
import { attachToolbar } from "./widget-keys";

import { popoverSupported, usePopoverState } from "./Popover";

export interface ActionGroupProps {
    class?: string;
    /** aria-label for the group (required) */
    label: string;
    /** Whether the overflow menu is open */
    overflowOpen?: boolean;
    /** aria-label for the overflow trigger button */
    overflowLabel?: string;
    /** Overflow trigger click handler; call preventDefault() to keep the menu as it is */
    onOverflowToggle?: (event: MouseEvent) => void;
    /** Called when the overflow menu opens or closes, including Escape and light dismiss */
    onChange?: (value: boolean) => void;
    /** The visible action buttons */
    children?: JSX.Element;
    /** Content for the overflow menu */
    overflow?: JSX.Element;
    [key: string]: unknown;
}

export default function ActionGroup(props: ActionGroupProps) {
    const p = merge({ class: "" as const, overflowOpen: false }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "overflowOpen",
        "overflowLabel",
        "onOverflowToggle",
        "onChange",
        "children",
        "overflow",
    );
    const showOverflow = () => p.overflow !== undefined;
    const reactId = createUniqueId();
    const menuId = () => `action-group-${reactId}-overflow-menu`;
    const menu: { current: HTMLDivElement | null } = { current: null };
    const [open, setOpen] = createSignal(() => p.overflowOpen);

    function change(value: boolean) {
        setOpen(value);
        p.onChange?.(value);
    }
    // popover="auto": the trigger's command="toggle-popover" opens and closes the menu; without the API the click
    // toggles and `hidden` shows or hides it.
    usePopoverState(menu, open, () => change);

    function handleToggle(event: MouseEvent) {
        p.onOverflowToggle?.(event);
        if (event.defaultPrevented) return;
        if (menu.current && !popoverSupported(menu.current)) change(!open());
    }
    const rootRef: { current: HTMLDivElement | null } = { current: null };
    onSettled(() => untrack(() => attachToolbar(rootRef.current!)));

    return (
        <div
            ref={(el) => (rootRef.current = el)}
            class={`action-group ${p.class}`}
            role="group"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
            {showOverflow() && (
                <>
                    <button
                        class="action-group-overflow-trigger"
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={attr(open())}
                        aria-label={p.overflowLabel}
                        aria-controls={menuId()}
                        popovertarget={menuId()}
                        {...{ command: "toggle-popover", commandfor: menuId() }}
                        onClick={handleToggle}
                    >
                        …
                    </button>
                    <div
                        ref={(el) => (menu.current = el)}
                        class="action-group-overflow-menu"
                        id={menuId()}
                        popover="auto"
                    >
                        {p.overflow}
                    </div>
                </>
            )}
        </div>
    );
}
