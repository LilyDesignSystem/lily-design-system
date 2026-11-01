// Drawer component
//
// A panel that slides in from an edge of the viewport, typically used for
// navigation menus, filters, or supplementary content. Renders conditionally
// based on the open state as a native <dialog> opened with showModal(), so it is
// really modal. The side prop indicates which edge via a
// data-side attribute for consumer positioning and animation styles.
//
// Props:
//   className — string, optional. CSS class name.
//   open — boolean, default false. Whether the drawer is visible; bindable.
//   label — string, required. Accessible name for the drawer.
//   side — "left" | "right" | "top" | "bottom", default "left". Edge the drawer enters from.
//   children — ReactNode, required. Drawer content.
//   ...restProps — additional HTML attributes spread onto the <dialog>.
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
//   - Escape: closes the drawer (keydown or the native cancel event)
//   - Tab: stays inside while open (showModal())
//
// Accessibility:
//   - role="dialog" provided natively by the <dialog> element
//   - aria-label provides the accessible name
//   - aria-modal="true" is true: showModal() makes the page behind inert and traps Tab
//   - focus moves inside on open and returns to the opener on close
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

import React, { useEffect, useRef, useState } from "react";

export interface DrawerProps {
    className?: string;
    /** Accessible label for the dialog. */
    label: string;
    /** Whether the panel is open. Bindable. */
    open?: boolean;
    /** Edge the panel enters from. */
    side?: "left" | "right" | "top" | "bottom";
    /** Panel content. */
    children: React.ReactNode;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function Drawer({
    className = "",
    label,
    open: openProp = false,
    side = "left",
    onChange,
    children,
    ...restProps
}: DrawerProps) {
    const [open, setOpen] = useState(openProp);
    const ref = useRef<HTMLDialogElement>(null);

    // Sync internal state when the prop changes externally.
    useEffect(() => {
        setOpen(openProp);
    }, [openProp]);

    // A real modal: showModal() puts the <dialog> in the top layer, makes the page behind it inert and traps Tab.
    // Where showModal is missing (jsdom) fall back to the open attribute. Focus moves inside on open and returns to
    // the element that had it when the panel opened, once it closes.
    useEffect(() => {
        const node = ref.current;
        if (!open || !node) return;
        const opener = document.activeElement as HTMLElement | null;
        if (!node.open) {
            if (typeof node.showModal === "function") node.showModal();
            else node.setAttribute("open", "");
        }
        if (!node.contains(document.activeElement)) node.focus();
        return () => {
            if (node.open) {
                if (typeof node.close === "function") node.close();
                else node.removeAttribute("open");
            }
            if (opener && opener !== document.body && opener.isConnected) opener.focus();
        };
    }, [open]);

    function dismiss() {
        setOpen(false);
        onChange?.(false);
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Escape") {
            event.preventDefault();
            dismiss();
        }
    }

    function handleCancel(event: React.SyntheticEvent) {
        event.preventDefault();
        dismiss();
    }

    return (
        <>
            {open && (
                <dialog
                    ref={ref}
                    className={`drawer ${className}`}
                    aria-label={label}
                    aria-modal="true"
                    tabIndex={-1}
                    data-side={side}
                    onKeyDown={handleKeyDown}
                    onCancel={handleCancel}
                    onClose={dismiss}
                    {...restProps}
                >
                    {children}
                </dialog>
            )}
        </>
    );
}
