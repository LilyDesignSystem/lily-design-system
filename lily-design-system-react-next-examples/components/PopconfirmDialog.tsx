// PopconfirmDialog component
//
// A popover dialog with confirm and cancel buttons (e.g. "Are you sure?").
// Unlike Dialog/AlertDialog this one is NOT modal — it floats next to its
// trigger and aria-modal="false". Stable IDs for the title and description
// are generated with `useId()` so aria-labelledby and aria-describedby work
// across renders.
//
// Props:
//   className     — string, optional. CSS class name.
//   open          — boolean, default false. Whether the dialog is visible.
//   title         — string, REQUIRED. Heading text.
//   description   — string, optional. Body text.
//   confirmLabel  — string, REQUIRED. Confirm button text.
//   cancelLabel   — string, REQUIRED. Cancel button text.
//   onConfirm     — (event: React.MouseEvent) => void, optional.
//   onCancel      — (event: React.MouseEvent) => void, optional.
//   ...restProps  — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <PopconfirmDialog
//     open={isOpen}
//     title="Delete this item?"
//     description="This cannot be undone."
//     confirmLabel="Delete"
//     cancelLabel="Cancel"
//     onConfirm={handleDelete}
//     onCancel={handleClose}
//   />
//
// Accessibility:
//   - role="alertdialog", aria-modal="false"
//   - aria-labelledby points at the title <h2>
//   - aria-describedby points at the description <p> (only when present)
//
// Internationalization:
//   - title, description, confirmLabel, cancelLabel are all consumer-supplied.
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - Required string props are non-optional in the interface
//   - Use useId() for stable id generation
//
// References:
//   - Ant Design Popconfirm: https://ant.design/components/popconfirm
//   - WAI-ARIA Alertdialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/

import React, { useId } from "react";

export interface PopconfirmDialogProps {
    className?: string;
    /** Whether the dialog is visible */
    open?: boolean;
    /** Heading text (required) */
    title: string;
    /** Body text */
    description?: string;
    /** Confirm button text (required) */
    confirmLabel: string;
    /** Cancel button text (required) */
    cancelLabel: string;
    /** Confirm event handler */
    onConfirm?: (event: React.MouseEvent) => void;
    /** Cancel event handler */
    onCancel?: (event: React.MouseEvent) => void;
    [key: string]: unknown;
}

export default function PopconfirmDialog({
    className = "",
    open = false,
    title,
    description = undefined,
    confirmLabel,
    cancelLabel,
    onConfirm = undefined,
    onCancel = undefined,
    ...restProps
}: PopconfirmDialogProps) {
    const reactId: string = useId();
    const titleId: string = `popconfirm-${reactId}-title`;
    const descId: string = `popconfirm-${reactId}-desc`;
    return (
        <div
            className={`popconfirm-dialog ${className}`}
            role="alertdialog"
            aria-modal="false"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            hidden={!open}
            {...restProps}
        >
            <h2 className="popconfirm-dialog-title" id={titleId}>
                {title}
            </h2>
            {description ? (
                <p className="popconfirm-dialog-description" id={descId}>
                    {description}
                </p>
            ) : null}
            <button
                className="popconfirm-dialog-cancel"
                type="button"
                onClick={onCancel}
            >
                {cancelLabel}
            </button>
            <button
                className="popconfirm-dialog-confirm"
                type="button"
                onClick={onConfirm}
            >
                {confirmLabel}
            </button>
        </div>
    );
}
