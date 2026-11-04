// Popup component
//
// A headless overlay dialog that temporarily appears over the main
// content to convey information, prompt user actions, or display additional
// options. It renders a <div role="dialog" popover="auto"> (the native Popover API:
// top layer, Escape and light dismiss, no script) and reports the browser's changes
// through onChange. Similar to Popover but designed as a general-purpose overlay dialog.
// Commonly used for confirmations, prompts, contextual actions, and inline forms.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the popup dialog via aria-label.
//   open — boolean, default false, controlled. Whether the popup is visible.
//   onChange — (value: boolean) => void. Called when the browser opens or closes it
//     (Escape, light dismiss, a command="toggle-popover" trigger).
//   id — string, optional (rest prop). Give one so a trigger can name it with commandfor.
//   children — ReactNode, required. Content rendered inside the dialog.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Popup label="Info" open={open} onChange={setOpen}>{children}</Popup>
//
// Examples:
//
//   <button type="button" command="toggle-popover" commandfor="info">Toggle info</button>
//   <Popup id="info" label="Additional information" open={open} onChange={setOpen}>
//     <p>Here is some contextual information.</p>
//   </Popup>
//
// Keyboard:
//   - Escape: the browser closes the popup (Popover API) and onChange(false) fires;
//     where the API is missing the consumer closes it
//   - Tab: not trapped; a popover is non-modal
//
// Accessibility:
//   - role="dialog" identifies the popup as a dialog overlay
//   - aria-label provides the accessible name for the dialog
//   - Always in the DOM so a trigger can name its id; closed it is not displayed
//     (the popover UA style, or `hidden` where the Popover API is missing)
//
// Internationalization:
//   - The label prop is the only text; all content comes through children
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Consumer provides the trigger (command="toggle-popover" commandfor={id})
//   - Native first: popover="auto", with a scripted fallback (usePopoverState)
//
// References:
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
//   - WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog

import React from "react";

import { usePopoverState } from "./Popover";
import { warnMissingName } from "./dev-warning";

export interface PopupProps {
    className?: string;
    /** Accessible label for the popup dialog. */
    label: string;
    /** Whether the popup is visible. Bindable. */
    open?: boolean;
    /** Content rendered inside the popup. */
    children: React.ReactNode;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function Popup({
    className = "",
    label,
    open = false,
    onChange,
    children,
    ...restProps
}: PopupProps) {
    warnMissingName("Popup", label, restProps["aria-label"], restProps["aria-labelledby"]);
    const ref = React.useRef<HTMLDivElement>(null);
    usePopoverState(ref, open, onChange);
    return (
        <div
            ref={ref}
            className={`popup ${className}`}
            role="dialog"
            aria-label={label}
            popover="auto"
            {...restProps}
        >
            {children}
        </div>
    );
}
