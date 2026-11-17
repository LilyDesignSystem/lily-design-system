// AlertDialog component
//
// A headless modal alert dialog for critical interactions that require user
// acknowledgment before continuing. Uses the native HTML <dialog> element
// with the ARIA alertdialog role. Distinguished from regular Dialog by the
// alertdialog role, which signals to assistive technologies that the content
// requires immediate attention.
//
// Common uses: confirming irreversible actions ("Delete this item?"),
// warning about unsaved changes, or displaying critical error messages.
//
// Props:
//   class — string, optional. CSS class name.
//   open        — boolean, default false, bindable. Whether the dialog is visible.
//   title       — string, required. Dialog heading, referenced by aria-labelledby.
//   description — string, optional. Dialog message, referenced by aria-describedby.
//   children    — ReactNode, required. Action buttons and additional content.
//   ...restProps — additional HTML attributes spread onto <dialog>.
//
// Syntax:
//   <AlertDialog open={open} onChange={setOpen} title="Confirm" description="Are you sure?">
//     <button>Yes</button>
//     <button>No</button>
//   </AlertDialog>
//
// Examples:
//
//   <AlertDialog open={showDialog} onChange={setShowDialog} title="Confirm Deletion"
//     description="This action cannot be undone.">
//     <button onClick={handleConfirm}>Yes, delete</button>
//     <button onClick={handleCancel}>Cancel</button>
//   </AlertDialog>
//
//
//   <AlertDialog open={showAlert} onChange={setShowAlert} title="Session Expired">
//     <button onClick={() => setShowAlert(false)}>OK</button>
//   </AlertDialog>
//
// Keyboard:
//   - Escape: closes the dialog (showModal(): the browser fires cancel; the component calls onChange(false))
//   - Tab: stays inside the dialog (the browser traps it while the dialog is modal)
//
// Accessibility:
//   - role="alertdialog" signals critical content requiring acknowledgment
//   - aria-modal="true" indicates modal behavior to assistive technologies
//   - aria-labelledby references the title element
//   - aria-describedby references the description element (when present)
//   - Conditionally rendered with {open && ...} to remove from DOM when closed
//
// Internationalization:
//   - Title and description come through props
//   - Action buttons come through children prop
//   - No hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - The open prop must use controlled for two-way binding
//   - Do not use heading elements; use <p><strong> for the title
//   - Distinct from Dialog: use AlertDialog only for critical messages
//
// References:
//   - WAI-ARIA alertdialog role: https://www.w3.org/TR/wai-aria-1.2/#alertdialog
//   - WAI-ARIA Alert and Message Dialogs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/

import type { JSX } from "@solidjs/web";
import { omit, createUniqueId } from "solid-js";
import { withDefaults } from "./defaults";
import { useModalDialog } from "./Dialog";

export interface AlertDialogProps {
    class?: string;
    /** Whether the dialog is visible */
    open?: boolean;
    /** The dialog title for the heading and aria-labelledby */
    title: string;
    /** The dialog description/message for aria-describedby */
    description?: string;
    /** The dialog action buttons and content */
    children: JSX.Element;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function AlertDialog(props: AlertDialogProps) {
    const p = withDefaults({ class: "" as const, open: false }, props);
    const restProps = omit(p, "class", "open", "title", "description", "onChange", "children");
    const uid = createUniqueId();
    const titleId = () => `alert-dialog-title-${uid}`;
    const descriptionId = () => `alert-dialog-description-${uid}`;
    const ref: { current: HTMLDialogElement | null } = { current: null };

    // A real modal (tasks.md P14-T4): showModal() makes the page behind inert and traps Tab; Escape fires `cancel`.
    useModalDialog(ref, () => p.open);

    function handleCancel(event: Event) {
        event.preventDefault();
        p.onChange?.(false);
    }

    return (
        <>
            {p.open && (
                <>
                    <dialog
                        ref={(el) => (ref.current = el)}
                        class={`alert-dialog ${p.class}`}
                        role="alertdialog"
                        aria-labelledby={titleId()}
                        aria-describedby={p.description ? descriptionId() : undefined}
                        aria-modal="true"
                        onCancel={handleCancel}
                        onClose={() => p.onChange?.(false)}
                        {...restProps}
                    >
                        <div>
                            <p id={titleId()}>
                                <strong>{p.title}</strong>
                            </p>
                            {p.description && (
                                <>
                                    <p id={descriptionId()}>{p.description}</p>
                                </>
                            )}
                            {p.children}
                        </div>
                    </dialog>
                </>
            )}
        </>
    );
}
