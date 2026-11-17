// Menu component
//
// A headless menu container using the ARIA menu role with full vertical
// keyboard navigation. It renders a <div> with role="menu" and manages focus
// movement between child menuitem elements via arrow keys. Menus present a
// list of discrete actions or commands, such as context menus, action menus
// triggered by buttons, or dropdown menus.
//
// Props:
//   class — string, optional. CSS class name.
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

import type { JSX } from "@solidjs/web";
import { omit, onSettled, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { attachMenu } from "./menu-keys";
import { warnMissingName } from "./dev-warning";

export interface MenuProps {
    class?: string;
    /** Accessible label for the menu. */
    label: string;
    /** Menu item elements. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Menu(props: MenuProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    warnMissingName("Menu", p.label, p["aria-label"], p["aria-labelledby"]);
    const menuRef: { current: HTMLDivElement | null } = { current: null };

    onSettled(() => untrack(() => attachMenu(menuRef.current!, "vertical")));

    return (
        <div
            class={`menu ${p.class}`}
            role="menu"
            aria-label={p.label}
            ref={(el) => (menuRef.current = el)}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
