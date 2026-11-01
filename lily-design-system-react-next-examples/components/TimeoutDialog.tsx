// TimeoutDialog component
//
// A modal dialog warning users before session timeout (ported from the Svelte reference, tasks.md P14-T4). The
// <dialog> is always rendered and shown while `open`: as a real modal with showModal() (top layer, inert page, Tab
// trapped) where the browser has it, else with the open attribute. Focus returns to the opener when it closes.
//
// Props:
//   className — string, optional. Extra CSS class on the root.
//   label — string, optional. Accessible name via aria-label.
//   open — boolean, default false. Whether the dialog is shown.
//   children — ReactNode, required. The warning and its actions, supplied by the consumer.
//   ...restProps — spread onto the <dialog>.
//
// Accessibility:
//   - role="alertdialog": the time-out warning needs the user's response
//   - the consumer's actions (stay signed in, sign out) are inside the dialog
//
// Internationalization:
//   - No hardcoded strings: the label and all content are the consumer's

import React, { useRef } from "react";

import { useModalDialog } from "./Dialog";

export interface TimeoutDialogProps {
    className?: string;
    label?: string;
    /** Whether the dialog is shown. */
    open?: boolean;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function TimeoutDialog({
    className = "",
    label = undefined,
    open = false,
    children,
    ...restProps
}: TimeoutDialogProps) {
    const ref = useRef<HTMLDialogElement>(null);
    useModalDialog(ref, open);

    return (
        <dialog
            ref={ref}
            className={`timeout-dialog ${className}`}
            role="alertdialog"
            aria-label={label}
            {...restProps}
        >
            {children}
        </dialog>
    );
}
