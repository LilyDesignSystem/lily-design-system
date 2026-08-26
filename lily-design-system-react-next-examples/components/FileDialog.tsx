// FileDialog component
//
// A modal dialog for file-related operations such as opening, saving, or
// managing files. Renders a native <dialog> element conditionally based on
// the open state, with accessible labeling and Escape key dismissal. Useful
// in file managers, document editors, and content management systems where
// the consumer provides file lists, action buttons, and navigation as children.
//
// Props:
//   className — string, optional. CSS class name.
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

import React from "react";

export interface FileDialogProps {
    className?: string;
    label: string;
    open?: boolean;
    children: React.ReactNode;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function FileDialog({
    className = "",
    label,
    open = false,
    onChange,
    children,
    ...restProps
}: FileDialogProps) {
    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Escape") {
            event.preventDefault();
            onChange?.(false);
        }
    }

    return (
        <>
        {open && (<><dialog
        className={`file-dialog ${className}`}
        open
        tabIndex={-1}
        aria-label={label}
        onKeyDown={handleKeyDown}
        {...restProps}
        >
        {children}
        </dialog></>)}
        </>
    );
}
