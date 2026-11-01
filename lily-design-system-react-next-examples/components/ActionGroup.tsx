// ActionGroup component
//
// A group of action buttons that can collapse to an overflow menu when
// space is constrained. The visible action buttons are passed via
// `children`; the overflow menu content is passed via the `overflow`
// prop (NOT children). Inspired by Adobe Spectrum.
//
// Props:
//   className         — string, optional. CSS class name.
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

import React, { useEffect, useId, useRef, useState } from "react";

import { popoverSupported, usePopoverState } from "./Popover";

export interface ActionGroupProps {
    className?: string;
    /** aria-label for the group (required) */
    label: string;
    /** Whether the overflow menu is open */
    overflowOpen?: boolean;
    /** aria-label for the overflow trigger button */
    overflowLabel?: string;
    /** Overflow trigger click handler; call preventDefault() to keep the menu as it is */
    onOverflowToggle?: (event: React.MouseEvent) => void;
    /** Called when the overflow menu opens or closes, including Escape and light dismiss */
    onChange?: (value: boolean) => void;
    /** The visible action buttons */
    children?: React.ReactNode;
    /** Content for the overflow menu */
    overflow?: React.ReactNode;
    [key: string]: unknown;
}

export default function ActionGroup({
    className = "",
    label,
    overflowOpen = false,
    overflowLabel = undefined,
    onOverflowToggle = undefined,
    onChange = undefined,
    children = undefined,
    overflow = undefined,
    ...restProps
}: ActionGroupProps) {
    const showOverflow = overflow !== undefined;
    const reactId = useId();
    const menuId = `action-group-${reactId}-overflow-menu`;
    const menu = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(overflowOpen);
    useEffect(() => setOpen(overflowOpen), [overflowOpen]);

    function change(value: boolean) {
        setOpen(value);
        onChange?.(value);
    }
    // popover="auto": the trigger's command="toggle-popover" opens and closes the menu; without the API the click
    // toggles and `hidden` shows or hides it.
    usePopoverState(menu, open, change);

    function handleToggle(event: React.MouseEvent) {
        onOverflowToggle?.(event);
        if (event.defaultPrevented) return;
        if (menu.current && !popoverSupported(menu.current)) change(!open);
    }
    return (
        <div
            className={`action-group ${className}`}
            role="group"
            aria-label={label}
            {...restProps}
        >
            {children}
            {showOverflow && (
                <>
                    <button
                        className="action-group-overflow-trigger"
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={open}
                        aria-label={overflowLabel}
                        aria-controls={menuId}
                        popoverTarget={menuId}
                        {...{ command: "toggle-popover", commandfor: menuId }}
                        onClick={handleToggle}
                    >
                        …
                    </button>
                    <div
                        ref={menu}
                        className="action-group-overflow-menu"
                        id={menuId}
                        popover="auto"
                    >
                        {overflow}
                    </div>
                </>
            )}
        </div>
    );
}
