// MenuBarButton component
//
// A single interactive item within a menu bar, using the ARIA menuitem role
// for keyboard navigation and screen reader support. It renders a <button> with
// role="menuitem" and tabindex="-1", designed to be placed inside a MenuBar
// container with role="menubar". Focus management is delegated to the parent
// MenuBar which uses roving tabindex with arrow keys.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. Content of the menu bar item.
//   ...restProps — additional HTML attributes spread onto the <button>.
//
// Syntax:
//   <MenuBarButton>File</MenuBarButton>
//
// Examples:
//   
//   <MenuBar label="Main menu">
//     <MenuBarButton>File</MenuBarButton>
//     <MenuBarButton>Edit</MenuBarButton>
//     <MenuBarButton>View</MenuBarButton>
//   </MenuBar>
//
// Keyboard:
//   - ArrowLeft/ArrowRight: focus movement managed by parent MenuBar
//   - Enter/Space: activate the menu item (consumer-provided handler)
//   - tabindex="-1" enables programmatic focus from parent keyboard navigation
//
// Accessibility:
//   - role="menuitem" identifies this as an item within a menubar
//   - tabindex="-1" removes from tab order; focus managed by parent MenuBar
//
// Internationalization:
//   - All visible content is provided through the children prop
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Compound component: must be placed inside a MenuBar container
//   - type="button" prevents accidental form submission
//
// References:
//   - WAI-ARIA Menu Bar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/

import React from "react";

export interface MenuBarButtonProps {
    className?: string;
    /** Content of the menu bar item. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function MenuBarButton({
    className = "",
    children,
    ...restProps
}: MenuBarButtonProps) {
    return (
        <button
        className={`menu-bar-button ${className}`}
        type="button"
        role="menuitem"
        tabIndex={-1}
        {...restProps}
        >
        {children}
        </button>
    );
}
