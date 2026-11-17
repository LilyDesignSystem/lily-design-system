// FileDialog component
//
// A modal dialog for file-related operations such as opening, saving, or
// managing files. Renders a native <dialog> element conditionally based on
// the open state, with accessible labeling and Escape key dismissal. Useful
// in file managers, document editors, and content management systems where
// the consumer provides file lists, action buttons, and navigation as children.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the dialog.
//   open — boolean, default false. Whether the dialog is visible; bindable.
//   children — ReactNode, required. Dialog content.
//   ...restProps — additional HTML attributes spread onto the <dialog> element.
//
// Syntax:
//   <FileDialog label="Open file" open={open} onChange={setOpen}>Content</FileDialog>
//
// Examples:
//
//   <FileDialog label="Open file" open={open} onChange={setOpen}>
//     <ul>
//       <li>document.txt</li>
//       <li>image.png</li>
//     </ul>
//     <button onClick={() => setOpen(false)}>Cancel</button>
//   </FileDialog>
//
// Keyboard:
//   - Escape: closes the dialog by setting open to false
//
// Accessibility:
//   - aria-label provides the accessible name
//   - Native <dialog> element provides implicit role="dialog"
//   - tabindex="-1" allows programmatic focus management
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Dialog removed from DOM when open is false
//   - Uses controlled on open for two-way state binding
//
// References:
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
//   - MDN dialog element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
import { useModalDialog } from "./Dialog";
import { warnMissingName } from "./dev-warning";

export interface FileDialogProps {
    class?: string;
    label: string;
    open?: boolean;
    children: JSX.Element;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function FileDialog(props: FileDialogProps) {
    const p = merge({ class: "" as const, open: false }, props);
    const restProps = omit(p, "class", "label", "open", "onChange", "children");
    warnMissingName("FileDialog", p.label, p["aria-label"], p["aria-labelledby"]);
    const ref: { current: HTMLDialogElement | null } = { current: null };

    // A real modal (tasks.md P14-T4): showModal() makes the page behind inert and traps Tab; Escape fires `cancel`.
    useModalDialog(ref, () => p.open);

    function handleCancel(event: Event) {
        event.preventDefault();
        p.onChange?.(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape" && !event.defaultPrevented) {
            event.preventDefault();
            p.onChange?.(false);
        }
    }

    return (
        <>
            {p.open && (
                <>
                    <dialog
                        ref={(el) => (ref.current = el)}
                        class={`file-dialog ${p.class}`}
                        tabindex={attr(-1)}
                        aria-label={p.label}
                        aria-modal="true"
                        onKeyDown={handleKeyDown}
                        onCancel={handleCancel}
                        onClose={() => p.onChange?.(false)}
                        {...restProps}
                    >
                        {p.children}
                    </dialog>
                </>
            )}
        </>
    );
}
