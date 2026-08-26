// ContextMenuItem component
//
// A headless context menu item representing a single action within a context menu.
// Renders a <div> with role="menuitem" and tabindex="-1" for proper menu keyboard
// navigation. Focus is managed programmatically by the parent ContextMenu component
// using Arrow keys. Should be placed within a role="menu" container. Commonly used
// for right-click menu actions like cut, copy, paste, and delete.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. Menu item content (text, shortcut hint, etc.).
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <ContextMenuItem>Cut</ContextMenuItem>
//
// Examples:
//   
//   <ContextMenuItem>Cut</ContextMenuItem>
//   <ContextMenuItem>Copy</ContextMenuItem>
//   <ContextMenuItem>Paste</ContextMenuItem>
//   <ContextMenuItem aria-disabled="true">Delete</ContextMenuItem>
//
// Keyboard:
//   - Focus is managed by the parent menu using ArrowUp/ArrowDown
//   - Enter/Space: Activate the menu item (handled by consumer event listeners)
//
// Accessibility:
//   - role="menuitem" identifies this element as an item within a menu
//   - tabindex="-1" supports roving focus management by the parent menu
//   - Consumer can add aria-disabled="true" for disabled items
//   - Consumer can add aria-keyshortcuts for keyboard shortcut hints
//
// Internationalization:
//   - All content is provided through the children prop; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Compound component: used as a child within ContextMenu
//   - Must be placed inside a role="menu" container
//
// References:
//   - WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/

import React from "react";

export interface ContextMenuItemProps {
    className?: string;
    /** Menu item content (text, icon, shortcut hint, etc.) */
    children: React.ReactNode;
    /** Additional HTML attributes */
    [key: string]: unknown;
}

export default function ContextMenuItem({
    className = "",
    children,
    ...restProps
}: ContextMenuItemProps) {
    return (
        
        <div
        className={`context-menu-item ${className}`}
        role="menuitem"
        tabIndex={-1}
        {...restProps}
        >
        {children}
        </div>
    );
}
