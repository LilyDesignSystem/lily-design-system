// HamburgerMenu component
//
// A hamburger menu toggle button that reveals or hides a navigation panel. Commonly
// used on mobile layouts and compact interfaces to conserve screen space by hiding
// the primary navigation behind a toggle control. Manages ARIA attributes linking the
// toggle button to the navigation panel via aria-controls and aria-expanded.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, default "Menu". Accessible name for the toggle button and navigation region.
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
//   <HamburgerMenu open={menuOpen} onChange={setMenuOpen}>
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
//   - The label prop allows localized accessible names; default "Menu" should be overridden for non-English locales
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

import React, { useState, useId } from "react";

export interface HamburgerMenuProps {
    className?: string;
    label?: string;
    open?: boolean;
    children: React.ReactNode;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function HamburgerMenu({
    className = "",
    label = "Menu",
    open: openProp = false,
    onChange,
    children,
    ...restProps
}: HamburgerMenuProps) {
    const [open, setOpen] = useState(openProp);
    const menuId = useId();

    const handleClick = () => {
        const newOpen = !open;
        setOpen(newOpen);
        onChange?.(newOpen);
    };

    return (
        <div
        className={`hamburger-menu ${className}`}
        {...restProps}
        >
        <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={handleClick}
        >
        {label}
        </button>
        {open && (
        <nav
        id={menuId}
        aria-label={label}
        >
        {children}
        </nav>
        )}
        </div>
    );
}
