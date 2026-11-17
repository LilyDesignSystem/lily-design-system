// Dialog component
//
// A modal or non-modal dialog that overlays the main interface to communicate
// information or prompt users for input. Uses the native <dialog> element with
// conditional rendering. Common use cases include confirmations, alerts, forms,
// settings, and any interaction requiring focused user attention.
//
// Props:
//   class — string, optional. CSS class name.
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
//   - A modal dialog is opened with .showModal() (useModalDialog): top layer, inert page, Tab trapped; a
//     non-modal one (modal={false}) with the open attribute. The native cancel (Escape) and close events keep
//     open in step, and focus returns to the opener on close.
//
// References:
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
//   - MDN dialog element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
//   - WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog

import type { JSX } from "@solidjs/web";
import { createEffect, createSignal, merge, omit } from "solid-js";
import { attr } from "./attr";
import { warnMissingName } from "./dev-warning";

/**
 * Open a `<dialog>` while `active`: with `showModal()` when `modal` (top layer, inert page behind, Tab trapped,
 * Escape fires `cancel`), else with the `open` attribute. Where `showModal` is missing (jsdom) it falls back to the
 * attribute. Focus moves in on open and returns, on close, to the element that had it (tasks.md P14-T4; the same
 * logic as the Svelte catalog's Dialog/modal.ts and this catalog's Drawer).
 */
export function useModalDialog(
    ref: { current: HTMLDialogElement | null },
    active: () => boolean,
    modal: () => boolean = () => true,
): void {
    createEffect(
        () => [active(), modal()] as const,
        ([isActive, isModal]) => {
            const node = ref.current;
            if (!isActive || !node) return;
            const opener = document.activeElement as HTMLElement | null;
            if (!node.open) {
                if (isModal && typeof node.showModal === "function") node.showModal();
                else node.setAttribute("open", "");
            }
            // showModal() focuses the first focusable descendant itself; where it is missing do the same, else the dialog.
            if (!node.contains(document.activeElement)) {
                const first = node.querySelector<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
                );
                (first ?? node).focus();
            }
            return () => {
                if (node.open) {
                    if (typeof node.close === "function") node.close();
                    else node.removeAttribute("open");
                }
                if (opener && opener !== document.body && opener.isConnected) opener.focus();
            };
        },
    );
}

export interface DialogProps {
    class?: string;
    /** Whether the dialog is visible. Bindable. */
    open?: boolean;
    /** Accessible name for the dialog. */
    label: string;
    /** Whether the dialog is modal. */
    modal?: boolean;
    /** Dialog content. */
    children: JSX.Element;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function Dialog(props: DialogProps) {
    const p = merge({ class: "" as const, open: false, modal: true }, props);
    const restProps = omit(p, "class", "open", "label", "modal", "onChange", "children");
    warnMissingName("Dialog", p.label, p["aria-label"], p["aria-labelledby"]);
    const [open, setOpen] = createSignal(() => p.open);
    const ref: { current: HTMLDialogElement | null } = { current: null };

    useModalDialog(ref, open, () => p.modal);

    function dismiss() {
        setOpen(false);
        p.onChange?.(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape" && !event.defaultPrevented) {
            event.preventDefault();
            dismiss();
        }
    }

    function handleCancel(event: Event) {
        event.preventDefault();
        dismiss();
    }

    return (
        <>
            {open() && (
                <dialog
                    ref={(el) => (ref.current = el)}
                    class={`dialog ${p.class}`}
                    tabindex={attr(-1)}
                    aria-label={p.label}
                    aria-modal={attr(p.modal || undefined)}
                    onKeyDown={handleKeyDown}
                    onCancel={handleCancel}
                    onClose={dismiss}
                    {...restProps}
                >
                    {p.children}
                </dialog>
            )}
        </>
    );
}
