// DropdownMenu component
//
// A dropdown menu triggered by a button that reveals a list of actions or
// options. Combines a toggle button with a conditionally rendered menu panel.
// When the menu opens, focus moves automatically to the first menu item.
// Common use cases include action menus, settings menus, and context-sensitive
// option lists.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the menu button; also displayed as button text.
//   open — boolean, default false. Whether the menu is visible; bindable.
//   children — ReactNode, required. Menu items, each should have role="menuitem" and tabindex="-1".
//   ...restProps — additional HTML attributes spread onto the outer wrapper <div>.
//
// Syntax:
//   <DropdownMenu label="Options" open={open} onChange={setOpen}>
//     <li role="menuitem" tabindex="-1">Action</li>
//   </DropdownMenu>
//
// Examples:
//
//   <DropdownMenu label="Options" open={open} onChange={setOpen}>
//     <li role="menuitem" tabindex="-1">Edit</li>
//     <li role="menuitem" tabindex="-1">Duplicate</li>
//     <li role="menuitem" tabindex="-1">Delete</li>
//   </DropdownMenu>
//
//
//   <DropdownMenu label="Actions" open={menuOpen} onChange={setMenuOpen}>
//     <li role="menuitem" tabindex="-1" onClick={() => handleAction('edit')}>Edit</li>
//     <li role="menuitem" tabindex="-1" onClick={() => handleAction('delete')}>Delete</li>
//   </DropdownMenu>
//
// Keyboard:
//   - Enter/Space on button: toggles the menu open/closed
//   - ArrowDown: moves focus to the next menu item (wraps to first)
//   - ArrowUp: moves focus to the previous menu item (wraps to last)
//   - Home: moves focus to the first menu item
//   - End: moves focus to the last menu item
//   - Escape: closes the menu
//
// Accessibility:
//   - aria-haspopup="true" on the trigger button indicates it opens a menu
//   - aria-expanded communicates whether the menu is shown
//   - aria-label on both button and menu provides accessible names
//   - role="menu" on the menu container identifies it as a menu widget
//   - Consumer provides role="menuitem" on each child item
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Auto-focuses first menuitem on open via useEffect
//   - Menu items discovered dynamically via querySelectorAll("[role='menuitem']")
//   - Arrow navigation wraps around from last to first and vice versa
//
// References:
//   - WAI-ARIA Menu Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/
//   - WAI-ARIA menu role: https://www.w3.org/TR/wai-aria-1.2/#menu
//   - WAI-ARIA menuitem role: https://www.w3.org/TR/wai-aria-1.2/#menuitem

import React, { useEffect, useId, useRef, useState } from "react";

import { popoverSupported, usePopoverState } from "./Popover";

export interface DropdownMenuProps {
    className?: string;
    /** Accessible name for the menu button. */
    label: string;
    /** Whether the menu is open. Bindable. */
    open?: boolean;
    /** Menu items. */
    children: React.ReactNode;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function DropdownMenu({
    className = "",
    label,
    open: openProp = false,
    onChange,
    children,
    ...restProps
}: DropdownMenuProps) {
    const reactId = useId();
    const menuId = `dropdown-menu-${reactId}`;
    const [open, setOpen] = useState(openProp);
    useEffect(() => setOpen(openProp), [openProp]);
    const menuRef = useRef<HTMLDivElement>(null);

    function change(value: boolean) {
        setOpen(value);
        onChange?.(value);
    }
    // popover="auto": the trigger's command="toggle-popover" opens and closes the menu, and Escape and light dismiss
    // come from the browser; the toggle event reports each change. Without the API the click toggles and `hidden`
    // shows or hides the menu.
    usePopoverState(menuRef, open, change);

    function toggleMenu() {
        if (menuRef.current && !popoverSupported(menuRef.current)) change(!open);
    }

    function onMenuKeydown(event: React.KeyboardEvent) {
        if (!menuRef.current) return;
        const items = Array.from(
            menuRef.current.querySelectorAll<HTMLElement>("[role='menuitem']"),
        );
        const current = document.activeElement as HTMLElement;
        const index = items.indexOf(current);

        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                const next = index < items.length - 1 ? index + 1 : 0;
                items[next]?.focus();
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : items.length - 1;
                items[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                items[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                items[items.length - 1]?.focus();
                break;
            }
            case "Escape": {
                event.preventDefault();
                change(false);
                break;
            }
        }
    }

    return (
        <div
            className={`dropdown-menu ${className}`}
            {...restProps}
        >
            <button
                type="button"
                aria-haspopup="true"
                aria-expanded={open}
                aria-label={label}
                aria-controls={menuId}
                popoverTarget={menuId}
                {...{ command: "toggle-popover", commandfor: menuId }}
                onClick={toggleMenu}
            >
                {label}
            </button>
            <div
                id={menuId}
                role="menu"
                aria-label={label}
                tabIndex={-1}
                popover="auto"
                ref={menuRef}
                onKeyDown={onMenuKeydown}
            >
                {children}
            </div>
        </div>
    );
}
