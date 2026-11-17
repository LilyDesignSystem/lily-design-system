// MenuBar component
//
// A headless horizontal menu bar using the ARIA menubar role, typically found
// at the top of an application window. It renders a <div> with role="menubar"
// and manages horizontal focus movement between top-level menu items via
// ArrowLeft/ArrowRight keys, mimicking desktop application menu bars (e.g.,
// File, Edit, View). Each top-level item may open a submenu or trigger an action.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name applied via aria-label.
//   children — ReactNode, required. MenuBarButton elements.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <MenuBar label="Main menu">
//     <MenuBarButton>File</MenuBarButton>
//   </MenuBar>
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
//   - ArrowRight: move focus to next menu bar item, wrapping from last to first
//   - ArrowLeft: move focus to previous menu bar item, wrapping from first to last
//   - Home: move focus to the first menu bar item
//   - End: move focus to the last menu bar item
//
// Accessibility:
//   - role="menubar" identifies the container as a horizontal menu bar widget
//   - aria-label provides an accessible name describing the menu bar purpose
//   - Child MenuBarButton elements provide role="menuitem" with tabindex="-1"
//
// Internationalization:
//   - The label prop accepts any translated string
//   - All menu bar item content comes through the children prop
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Compound component: pair with MenuBarButton for individual entries
//   - Uses horizontal (ArrowLeft/ArrowRight) navigation, not vertical
//   - Arrow keys wrap around at boundaries
//
// References:
//   - WAI-ARIA Menu Bar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/

import type { JSX } from "@solidjs/web";
import { omit, onSettled, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { attachMenu } from "./menu-keys";
import { warnMissingName } from "./dev-warning";

export interface MenuBarProps {
    class?: string;
    /** Accessible label. */
    label: string;
    /** MenuBarButton elements. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function MenuBar(props: MenuBarProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    warnMissingName("MenuBar", p.label, p["aria-label"], p["aria-labelledby"]);
    const barRef: { current: HTMLDivElement | null } = { current: null };

    onSettled(() => untrack(() => attachMenu(barRef.current!, "horizontal")));

    return (
        <div
            class={`menu-bar ${p.class}`}
            role="menubar"
            aria-label={p.label}
            ref={(el) => (barRef.current = el)}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
