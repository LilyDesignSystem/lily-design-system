// Show and hide a popover="auto" element through the Popover API, or with the `hidden` attribute.
//
// A popover="auto" element is in the top layer while open, and the browser closes it on Escape and on a click
// outside it (light dismiss). A button with command="toggle-popover" commandfor="<id>" (or popovertarget="<id>")
// opens and closes it with no script. Each change fires a `toggle` event whose `newState` is "open" or "closed":
// bind it with @toggle and write `toggleOpened(event)` back to the model.
//
// Where the Popover API is missing (jsdom, browsers before Chrome 114, Firefox 125 and Safari 17) the element falls
// back to the `hidden` attribute, and drops `popover`, which jsdom's UA stylesheet would otherwise hide for good.
// Used by the menu group (tasks.md P18-T11); the same logic as the Svelte catalog's Popover/popover.ts.
import { onMounted, watch, type Ref } from "vue";

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
    // Showing an open popover or hiding a closed one throws InvalidStateError in older engines.
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

/** Keep the element in step with `open`: on mount and on every change. */
export function usePopoverState(
    el: Ref<HTMLElement | null | undefined>,
    open: Ref<boolean | undefined>,
): void {
    const sync = () => {
        if (el.value) syncPopover(el.value, Boolean(open.value));
    };
    onMounted(sync);
    watch(open, sync);
}
