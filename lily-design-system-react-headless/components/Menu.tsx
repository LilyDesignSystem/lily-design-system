// Menu component
//
// A headless menu container using the ARIA menu role with full vertical
// keyboard navigation. It renders a <div> with role="menu" and manages focus
// movement between child menuitem elements via arrow keys. Menus present a
// list of discrete actions or commands, such as context menus, action menus
// triggered by buttons, or dropdown menus.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name applied via aria-label.
//   children — ReactNode, required. Menu item elements (should have role="menuitem" and tabindex="-1").
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Menu label="Actions">
//     <div role="menuitem" tabindex="-1">Cut</div>
//   </Menu>
//
// Examples:
//
//   <Menu label="Actions">
//     <div role="menuitem" tabindex="-1">Cut</div>
//     <div role="menuitem" tabindex="-1">Copy</div>
//     <div role="menuitem" tabindex="-1">Paste</div>
//   </Menu>
//
//
//   <Menu label="File actions">
//     {actions.map((action) => (
//       <div role="menuitem" tabindex="-1" onClick={() => handleAction(action)}>
//         {action.label}
//       </div>
//     ))}
//   </Menu>
//
// Keyboard:
//   - ArrowDown: move focus to next menu item, wrapping from last to first
//   - ArrowUp: move focus to previous menu item, wrapping from first to last
//   - Home: move focus to the first menu item
//   - End: move focus to the last menu item
//
// Accessibility:
//   - role="menu" identifies the container as a menu widget for actions
//   - aria-label provides an accessible name describing the menu purpose
//   - Child elements should use role="menuitem" with tabindex="-1"
//
// Internationalization:
//   - The label prop accepts any translated string
//   - All menu item content comes through the children prop
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Compound component: pair with MenuItem for individual menu actions
//   - Arrow keys wrap around at boundaries
//
// References:
//   - WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/

import React, { useEffect, useRef } from "react";
import { attachMenu } from "./menu-keys";
import { warnMissingName } from "./dev-warning";

export interface MenuProps {
    className?: string;
    /** Accessible label for the menu. */
    label: string;
    /** Menu item elements. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Menu({ className = "", label, children, ...restProps }: MenuProps) {
    warnMissingName("Menu", label, restProps["aria-label"], restProps["aria-labelledby"]);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => attachMenu(menuRef.current!, "vertical"), []);

    return (
        <div
            className={`menu ${className}`}
            role="menu"
            aria-label={label}
            ref={menuRef}
            {...restProps}
        >
            {children}
        </div>
    );
}
