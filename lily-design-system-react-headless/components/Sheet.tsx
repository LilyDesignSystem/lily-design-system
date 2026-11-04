// Sheet component
//
// A headless sliding panel overlay that appears from an edge of the viewport,
// functioning as a modal dialog (a native <dialog> opened with showModal()). Conditionally rendered based on the open state,
// with Escape key to dismiss. Commonly used for navigation menus, settings panels,
// detail views, or filter interfaces that slide in from the top, right, bottom, or left.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for the sheet dialog via aria-label.
//   open — boolean, default false. Whether the sheet is visible; controlled via open + onChange.
//   side — "left" | "right" | "top" | "bottom", default "right". Which edge the sheet appears from.
//   children — ReactNode, required. Content to render inside the sheet.
//   ...restProps — additional HTML attributes spread onto the <dialog>.
//
// Syntax:
//   <Sheet label="Settings" open={open} onChange={setOpen} side="right">
//     <p>Sheet content</p>
//   </Sheet>
//
// Examples:
//
//   <Sheet label="Navigation" open={navOpen} onChange={setNavOpen} side="left">
//     <nav><a href="/">Home</a></nav>
//   </Sheet>
//
//
//   <Sheet label="Actions" open={actionsOpen} onChange={setActionsOpen} side="bottom">
//     <button>Share</button>
//     <button>Delete</button>
//   </Sheet>
//
// Keyboard:
//   - Escape: closes the sheet (keydown or the native cancel event)
//   - Tab: stays inside while open (showModal())
//
// Accessibility:
//   - role="dialog" provided natively by the <dialog> element
//   - aria-label provides an accessible name for the dialog
//   - aria-modal="true" is true: showModal() makes the page behind inert and traps Tab
//   - focus moves inside on open and returns to the opener on close
//   - tabindex="-1" allows programmatic focus on the dialog container
//   - data-side attribute exposes the side for CSS targeting
//
// Internationalization:
//   - The label prop externalizes the accessible label string
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Open uses controlled state via open + onChange
//   - Focus trapping comes from showModal() (open-attribute fallback where it is missing, e.g. jsdom);
//     consumer implements slide-in animations via CSS
//   - Completely removed from DOM when closed ({open && ...})
//
// References:
//   - WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

import React, { useEffect, useRef, useState } from "react";
import { warnMissingName } from "./dev-warning";

export interface SheetProps {
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

export default function Sheet({
    className = "",
    label,
    open: openProp = false,
    side = "right",
    onChange,
    children,
    ...restProps
}: SheetProps) {
    warnMissingName("Sheet", label, restProps["aria-label"], restProps["aria-labelledby"]);
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
        if (event.key === "Escape" && !event.defaultPrevented) {
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
                    className={`sheet ${className}`}
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
