// Drawer component
//
// A panel that slides in from an edge of the viewport, typically used for
// navigation menus, filters, or supplementary content. Renders conditionally
// based on the open state and uses role="dialog" with aria-modal="true" for
// proper screen reader behavior. The side prop indicates which edge via a
// data-side attribute for consumer positioning and animation styles.
//
// Props:
//   className — string, optional. CSS class name.
//   open — boolean, default false. Whether the drawer is visible; bindable.
//   label — string, required. Accessible name for the drawer.
//   side — "left" | "right" | "top" | "bottom", default "left". Edge the drawer enters from.
//   children — ReactNode, required. Drawer content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Drawer label="Nav" open={open} onChange={setOpen} side="left">Content</Drawer>
//
// Examples:
//
//   <Drawer label="Navigation" open={open} onChange={setOpen} side="left">
//     <nav>...</nav>
//   </Drawer>
//
//
//   <Drawer label="Filters" open={showFilters} onChange={setShowFilters} side="right">
//     <form>...</form>
//   </Drawer>
//
// Keyboard:
//   - Escape: closes the drawer by setting open to false
//
// Accessibility:
//   - role="dialog" identifies the drawer as a dialog
//   - aria-label provides the accessible name
//   - aria-modal="true" indicates the drawer is modal
//   - tabindex="-1" allows programmatic focus management
//   - data-side attribute conveys position for consumer styling
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses controlled on open for two-way state binding
//   - Drawer is removed from DOM when open is false
//   - Consumer uses data-side for positioning CSS
//
// References:
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

import React, { useState } from "react";

export interface DrawerProps {
    className?: string;
    /** Whether the drawer is visible. Bindable. */
    open?: boolean;
    /** Accessible name for the drawer. */
    label: string;
    /** Edge the drawer enters from. */
    side?: "left" | "right" | "top" | "bottom";
    /** Drawer content. */
    children: React.ReactNode;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function Drawer({
    className = "",
    open: openProp = false,
    label,
    side = "left",
    onChange,
    children,
    ...restProps
}: DrawerProps) {
    const [open, setOpen] = useState(openProp);

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
            onChange?.(false);
        }
    }

    return (
        <>
        {open && (
        <div
        className={`drawer ${className}`}
        role="dialog"
        tabIndex={-1}
        aria-label={label}
        aria-modal="true"
        data-side={side}
        onKeyDown={handleKeyDown}
        {...restProps}
        >
        {children}
        </div>
        )}
        </>
    );
}
