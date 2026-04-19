// Dialog component
//
// A modal or non-modal dialog that overlays the main interface to communicate
// information or prompt users for input. Uses the native <dialog> element with
// conditional rendering. Common use cases include confirmations, alerts, forms,
// settings, and any interaction requiring focused user attention.
//
// Props:
//   className — string, optional. CSS class name.
//   open — boolean, default false. Whether the dialog is visible; bindable.
//   label — string, required. Accessible name for the dialog.
//   modal — boolean, default true. Whether the dialog behaves as a modal.
//   children — ReactNode, required. Dialog body content.
//   ...restProps — additional HTML attributes spread onto the <dialog> element.
//
// Syntax:
//   <Dialog label="Confirm" open={open} onChange={setOpen}>Content here</Dialog>
//
// Examples:
//
//   <Dialog label="Confirm action" open={showDialog} onChange={setShowDialog}>
//     <p>Are you sure you want to proceed?</p>
//     <button onClick={() => setShowDialog(false)}>Cancel</button>
//     <button onClick={() => { handleConfirm(); setShowDialog(false); }}>Confirm</button>
//   </Dialog>
//
//
//   <Dialog label="Notification" open={showNotice} onChange={setShowNotice} modal={false}>
//     <p>Your file has been saved.</p>
//   </Dialog>
//
// Keyboard:
//   - Escape: closes the dialog by setting open to false
//
// Accessibility:
//   - role="dialog" provided natively by the <dialog> element
//   - aria-label provides the accessible name
//   - aria-modal="true" when modal prop is true, indicating focus trap
//   - tabindex="-1" allows the dialog to receive focus for keyboard events
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses controlled on open for two-way state binding
//   - Dialog is removed from DOM entirely when open is false
//   - Uses open HTML attribute directly, not .showModal()
//
// References:
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
//   - MDN dialog element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
//   - WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog

import React, { useState } from "react";

export interface DialogProps {
    className?: string;
    /** Whether the dialog is visible. Bindable. */
    open?: boolean;
    /** Accessible name for the dialog. */
    label: string;
    /** Whether the dialog is modal. */
    modal?: boolean;
    /** Dialog content. */
    children: React.ReactNode;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function Dialog({
    className = "",
    open: openProp = false,
    label,
    modal = true,
    onChange,
    children,
    ...restProps
}: DialogProps) {
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
        <dialog
        className={`dialog ${className}`}
        open
        tabIndex={-1}
        aria-label={label}
        aria-modal={modal || undefined}
        onKeyDown={handleKeyDown}
        {...restProps}
        >
        {children}
        </dialog>
        )}
        </>
    );
}
