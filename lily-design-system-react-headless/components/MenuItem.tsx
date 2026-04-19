// MenuItem component
//
// A headless menu item representing a single action or option within a menu,
// dropdown menu, or navigation menu. It renders a <div> with role="menuitem"
// and tabindex="-1" for proper menu keyboard navigation. The parent menu
// component manages focus between items with ArrowUp/ArrowDown keys.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. Menu item content (text, shortcut hint, etc.).
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <MenuItem>New File</MenuItem>
//
// Examples:
//   
//   <Menu label="File">
//     <MenuItem>New File</MenuItem>
//     <MenuItem>Open File</MenuItem>
//     <MenuItem>Save</MenuItem>
//   </Menu>
//
//   
//   <MenuItem onClick={() => handleNew()}>New File</MenuItem>
//
//   
//   <MenuItem aria-disabled="true">Paste</MenuItem>
//
//   
//   <MenuItem aria-haspopup="true" aria-expanded={submenuOpen}>Recent Files</MenuItem>
//
// Keyboard:
//   - ArrowUp/ArrowDown: focus movement managed by parent Menu
//   - Enter/Space: activate the menu item (consumer-provided handler)
//   - Home/End: move to first/last item (handled by parent Menu)
//
// Accessibility:
//   - role="menuitem" identifies this as a menu item
//   - tabindex="-1" for roving focus management by the parent menu
//   - Supports aria-disabled for disabled state
//   - Supports aria-haspopup and aria-expanded for submenu triggers
//   - Must be placed within a role="menu" or role="menubar" container
//
// Internationalization:
//   - All visible content is provided through the children prop
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be placed inside a Menu or MenuBar container
//
// References:
//   - WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/
//   - WAI-ARIA menuitem role: https://www.w3.org/TR/wai-aria-1.2/#menuitem

import React from "react";

export interface MenuItemProps {
    className?: string;
    /** Menu item content (text, icon, shortcut hint, etc.) */
    children: React.ReactNode;
    /** Additional HTML attributes */
    [key: string]: unknown;
}

export default function MenuItem({
    className = "",
    children,
    ...restProps
}: MenuItemProps) {
    return (
        
        <div
        className={`menu-item ${className}`}
        role="menuitem"
        tabIndex={-1}
        {...restProps}
        >
        {children}
        </div>
    );
}
