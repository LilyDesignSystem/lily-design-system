// Show and hide a popover="auto" element through the Popover API, or with the `hidden` attribute.
//
// A popover="auto" element is in the top layer while open, and the browser closes it on Escape and on a click
// outside it (light dismiss). A button with command="toggle-popover" commandfor="<id>" (or popovertarget="<id>")
// opens and closes it with no script at all. Each of those changes fires a `toggle` event on the element, whose
// `newState` is "open" or "closed": listen to it to keep a bindable `open` in step.
//
// Where the Popover API is missing (jsdom, browsers before Chrome 114, Firefox 125 and Safari 17) the element
// falls back to the `hidden` attribute, which keeps it hidden or shown and testable; light dismiss and Escape are
// then the consumer's, as before. The fallback also drops the `popover` attribute, which does nothing there except
// in jsdom, whose UA stylesheet hides every [popover] it cannot open. Used as `use:popoverState={open}`.

/** Whether this element has the Popover API (`showPopover` and `hidePopover`). */
export function popoverSupported(node: HTMLElement): boolean {
    return typeof node.showPopover === "function" && typeof node.hidePopover === "function";
}

/** Open or close a popover element, or set `hidden` where the Popover API is missing. */
export function syncPopover(node: HTMLElement, open: boolean): void {
    if (!popoverSupported(node)) {
        node.removeAttribute("popover");
        node.toggleAttribute("hidden", !open);
        return;
    }
    // Showing an open popover or hiding a closed one is a no-op in current engines; older ones throw
    // InvalidStateError, as does an element that is not connected or has no popover attribute.
    try {
        if (open) node.showPopover();
        else node.hidePopover();
    } catch {
        // Already in that state, or not a valid popover: nothing to do.
    }
}

/** The `toggle` event's new state, as a boolean (true when the popover opened). */
export function toggleOpened(event: Event): boolean {
    return (event as ToggleEvent).newState === "open";
}

export function popoverState(node: HTMLElement, open: boolean) {
    let current = open;
    syncPopover(node, current);
    return {
        update(next: boolean) {
            if (next === current) return;
            current = next;
            syncPopover(node, current);
        },
    };
}
