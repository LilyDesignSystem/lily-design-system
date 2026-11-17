// PopconfirmDialog component
//
// A popover dialog with confirm and cancel buttons (e.g. "Are you sure?").
// Unlike Dialog/AlertDialog this one is NOT modal — it floats next to its
// trigger and aria-modal="false". Stable IDs for the title and description
// are generated with `useId()` so aria-labelledby and aria-describedby work
// across renders.
//
// Props:
//   class     — string, optional. CSS class name.
//   open          — boolean, default false. Whether the dialog is visible.
//   title         — string, REQUIRED. Heading text.
//   description   — string, optional. Body text.
//   confirmLabel  — string, REQUIRED. Confirm button text.
//   cancelLabel   — string, REQUIRED. Cancel button text.
//   onConfirm     — (event: MouseEvent) => void, optional.
//   onCancel      — (event: MouseEvent) => void, optional.
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

import { omit, createUniqueId } from "solid-js";
import { withDefaults } from "./defaults";
import { usePopoverState } from "./Popover";

export interface PopconfirmDialogProps {
    class?: string;
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
    onConfirm?: (event: MouseEvent) => void;
    /** Cancel event handler */
    onCancel?: (event: MouseEvent) => void;
    [key: string]: unknown;
}

export default function PopconfirmDialog(props: PopconfirmDialogProps) {
    const p = withDefaults({ class: "" as const, open: false }, props);
    const restProps = omit(
        p,
        "class",
        "open",
        "title",
        "description",
        "confirmLabel",
        "cancelLabel",
        "onConfirm",
        "onCancel",
    );
    const panelRef: { current: HTMLDivElement | null } = { current: null };
    usePopoverState(panelRef, () => p.open);
    const reactId = createUniqueId();
    const titleId = (): string => `popconfirm-${reactId}-title`;
    const descId = (): string => `popconfirm-${reactId}-desc`;
    return (
        <div
            class={`popconfirm-dialog ${p.class}`}
            role="alertdialog"
            aria-modal="false"
            aria-labelledby={titleId()}
            aria-describedby={p.description ? descId() : undefined}
            ref={(el) => (panelRef.current = el)}
            popover="manual"
            {...restProps}
        >
            <h2
                class="popconfirm-dialog-title"
                id={titleId()}
            >
                {p.title}
            </h2>
            {p.description ? (
                <p
                    class="popconfirm-dialog-description"
                    id={descId()}
                >
                    {p.description}
                </p>
            ) : null}
            <button
                class="popconfirm-dialog-cancel"
                type="button"
                onClick={p.onCancel}
            >
                {p.cancelLabel}
            </button>
            <button
                class="popconfirm-dialog-confirm"
                type="button"
                onClick={p.onConfirm}
            >
                {p.confirmLabel}
            </button>
        </div>
    );
}
