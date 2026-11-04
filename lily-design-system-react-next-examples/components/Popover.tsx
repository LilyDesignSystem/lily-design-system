// Popover component
//
// A headless dialog overlay that displays contextual information or
// actions near the element that triggered it. It renders a <div role="dialog">
// with popover="auto" (the native Popover API: top layer, Escape and light dismiss,
// no script) and keeps `open` in step through the element's toggle event. Unlike
// tooltips, popovers can contain rich interactive content such as forms, buttons, or other controls. Commonly used for contextual menus,
// information panels, and inline editing.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the popover dialog via aria-label.
//   open — boolean, default false, controlled. Whether the popover is visible.
//   onChange — (value: boolean) => void. Called when the browser opens or closes it
//     (Escape, light dismiss, a command="toggle-popover" trigger).
//   id — string, optional (rest prop). Give one so a trigger can name it with commandfor.
//   children — ReactNode, required. The popover content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Popover label="Info" open={open} onChange={setOpen}>{children}</Popover>
//
// Examples:
//
//   <button type="button" command="toggle-popover" commandfor="info">Toggle info</button>
//   <Popover id="info" label="Additional information" open={open} onChange={setOpen}>
//     <p>Here is some contextual information.</p>
//   </Popover>
//
// Keyboard:
//   - Escape: the browser closes the popover (Popover API) and onChange(false) fires;
//     where the API is missing the consumer closes it
//   - Tab: not trapped; a popover is non-modal
//
// Accessibility:
//   - role="dialog" identifies the popover as a dialog overlay
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
import { warnMissingName } from "./dev-warning";

/** Whether this element has the Popover API (`showPopover` and `hidePopover`). */
export function popoverSupported(node: HTMLElement): boolean {
    return typeof node.showPopover === "function" && typeof node.hidePopover === "function";
}

/**
 * Open or close a popover element. Where the Popover API is missing (jsdom, engines before Chrome 114,
 * Firefox 125 and Safari 17) it falls back to the `hidden` attribute, and drops the `popover` attribute,
 * which does nothing there except in jsdom, whose UA stylesheet hides every [popover] it cannot open.
 */
export function syncPopover(node: HTMLElement, open: boolean): void {
    if (!popoverSupported(node)) {
        node.removeAttribute("popover");
        node.toggleAttribute("hidden", !open);
        return;
    }
    // Showing an open popover or hiding a closed one is a no-op in current engines; older ones throw.
    try {
        if (open) node.showPopover();
        else node.hidePopover();
    } catch {
        // Already in that state, or not a valid popover: nothing to do.
    }
}

/**
 * Keep a popover="auto" element in step with `open`, and report the browser's own changes (Escape, light
 * dismiss, a command="toggle-popover" trigger) through `onChange`, from the element's `toggle` event.
 */
export function usePopoverState(
    ref: React.RefObject<HTMLElement | null>,
    open: boolean,
    onChange?: (value: boolean) => void,
): void {
    const onChangeRef = React.useRef(onChange);
    onChangeRef.current = onChange;
    React.useEffect(() => {
        if (ref.current) syncPopover(ref.current, open);
    }, [ref, open]);
    React.useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const listener = (event: Event) =>
            onChangeRef.current?.((event as ToggleEvent).newState === "open");
        node.addEventListener("toggle", listener);
        return () => node.removeEventListener("toggle", listener);
    }, [ref]);
}

export interface PopoverProps {
    className?: string;
    label: string;
    open?: boolean;
    children: React.ReactNode;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function Popover({
    className = "",
    label,
    open = false,
    onChange,
    children,
    ...restProps
}: PopoverProps) {
    warnMissingName("Popover", label, restProps["aria-label"], restProps["aria-labelledby"]);
    const ref = React.useRef<HTMLDivElement>(null);
    usePopoverState(ref, open, onChange);
    return (
        <div
            ref={ref}
            className={`popover ${className}`}
            role="dialog"
            aria-label={label}
            popover="auto"
            {...restProps}
        >
            {children}
        </div>
    );
}
