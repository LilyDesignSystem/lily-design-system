// HamburgerMenu component
//
// A hamburger menu toggle button that reveals or hides a navigation panel. Commonly
// used on mobile layouts and compact interfaces to conserve screen space by hiding
// the primary navigation behind a toggle control. Manages ARIA attributes linking the
// toggle button to the navigation panel via aria-controls and aria-expanded.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. No default: the words are yours. Accessible name for the toggle button and navigation region.
//   open — boolean, default false. Bindable boolean controlling whether the navigation panel is visible.
//   children — ReactNode, required. Navigation content rendered when the menu is open.
//   ...restProps — additional HTML attributes spread onto the outer div wrapper.
//
// Syntax:
//   <HamburgerMenu label="Main menu" open={open} onChange={setOpen}>{children}</HamburgerMenu>
//
// Examples:
//
//   <HamburgerMenu label="Main menu" open={open} onChange={setOpen}>
//     <nav>
//       <ul>
//         <li><a href="/">Home</a></li>
//         <li><a href="/about">About</a></li>
//       </ul>
//     </nav>
//   </HamburgerMenu>
//
//
//   <HamburgerMenu label="Main menu" open={menuOpen} onChange={setMenuOpen}>
//     <ul>
//       <li><a href="/dashboard">Dashboard</a></li>
//       <li><a href="/settings">Settings</a></li>
//     </ul>
//   </HamburgerMenu>
//
// Keyboard:
//   - Enter: Toggles the menu open/closed when the button has focus
//   - Space: Toggles the menu open/closed when the button has focus
//   - Tab: Moves focus to/from the toggle button and into the navigation content when open
//
// Accessibility:
//   - aria-label on the button provides an accessible name for the toggle control
//   - aria-expanded on the button indicates whether the navigation panel is visible
//   - aria-controls on the button references the id of the navigation panel
//   - role="navigation" on the content container identifies it as a navigation landmark
//   - aria-label on the navigation container provides an accessible name for the landmark
//
// Internationalization:
//   - The label prop supplies the accessible name in your language
//   - All content comes through the children prop
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses controlled for two-way binding on the open prop
//   - Generates a unique menuId for aria-controls/id linking
//   - Navigation content is fully removed from DOM when closed via {open && ...}
//
// References:
//   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
//   - WAI-ARIA Navigation Landmark: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/

import type { JSX } from "@solidjs/web";
import { omit, createSignal, createUniqueId, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { warnMissingName } from "./dev-warning";

export interface HamburgerMenuProps {
    class?: string;
    label: string;
    open?: boolean;
    children: JSX.Element;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function HamburgerMenu(props: HamburgerMenuProps) {
    const p = withDefaults({ class: "" as const, open: false }, props);
    const restProps = omit(p, "class", "label", "open", "onChange", "children");
    const [open, setOpen] = createSignal(untrack(() => p.open));
    warnMissingName("HamburgerMenu", p.label, p["aria-labelledby"]);
    const menuId = createUniqueId();

    const handleClick = () => {
        const newOpen = !open();
        setOpen(newOpen);
        p.onChange?.(newOpen);
    };

    return (
        <div
            class={`hamburger-menu ${p.class}`}
            {...restProps}
        >
            <button
                type="button"
                aria-label={p.label}
                aria-expanded={attr(open())}
                aria-controls={menuId}
                onClick={handleClick}
            >
                {p.label}
            </button>
            {open() && (
                <nav
                    id={menuId}
                    aria-label={p.label}
                >
                    {p.children}
                </nav>
            )}
        </div>
    );
}
