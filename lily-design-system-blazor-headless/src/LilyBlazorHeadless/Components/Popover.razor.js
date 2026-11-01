// Popover.razor.js — the Popover API bridge for Popover, Popup and ContextualHelp.
//
// The element is popover="auto": the browser puts it in the top layer while open
// and closes it on Escape and on a click outside it (light dismiss), and a button
// with command="toggle-popover" commandfor="<id>" (or popovertarget="<id>") opens
// it with no script — so static SSR works without this module. With
// interactivity, attach() opens or closes it from the component's state and
// reports the browser's own changes back to .NET through the `toggle` event.
//
// Where the Popover API is missing (browsers before Chrome 114, Firefox 125 and
// Safari 17) the element falls back to the `hidden` attribute, and the
// `trigger`, when given, toggles it on click.
//
// `options.menu` (DropdownMenu, SplitButton, ActionGroup, ContextMenu; tasks.md
// P18-T11) adds the WAI-ARIA APG menu focus code the platform has no
// equivalent for: opening focuses the first [role="menuitem"], ArrowDown /
// ArrowUp move between the items (wrapping), Home / End jump; and, in the
// fallback only, Escape closes and returns focus to the trigger.

function supported(node) {
    return typeof node.showPopover === "function" && typeof node.hidePopover === "function";
}

function sync(node, open) {
    if (!supported(node)) {
        node.removeAttribute("popover");
        node.hidden = !open;
        return;
    }
    try {
        if (open) node.showPopover();
        else node.hidePopover();
    } catch {
        // Already in that state (older engines throw): nothing to do.
    }
}

function items(node) {
    return Array.from(node.querySelectorAll("[role='menuitem']"));
}

export function attach(node, dotnet, open, trigger, options) {
    const menu = Boolean(options && options.menu);
    const opened = (value) => {
        if (value && menu) items(node)[0]?.focus();
        dotnet.invokeMethodAsync("OnPopoverToggle", value);
    };
    const onToggle = (event) => opened(event.newState === "open");
    node.addEventListener("toggle", onToggle);
    const onClick = (event) => {
        if (event.defaultPrevented || supported(node)) return;
        const next = node.hidden;
        sync(node, next);
        opened(next);
    };
    const onKeydown = (event) => {
        const list = items(node);
        const index = list.indexOf(document.activeElement);
        let next = -1;
        if (event.key === "ArrowDown") next = index < list.length - 1 ? index + 1 : 0;
        else if (event.key === "ArrowUp") next = index > 0 ? index - 1 : list.length - 1;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = list.length - 1;
        else if (event.key === "Escape" && !supported(node) && !node.hidden) {
            event.preventDefault();
            sync(node, false);
            opened(false);
            trigger?.focus();
            return;
        } else return;
        event.preventDefault();
        list[next]?.focus();
    };
    if (menu) node.addEventListener("keydown", onKeydown);
    if (trigger) trigger.addEventListener("click", onClick);
    sync(node, open);
    return {
        set(value) {
            sync(node, value);
            // With the API the toggle event focuses the first item; the fallback has no toggle event.
            if (value && menu && !supported(node)) items(node)[0]?.focus();
        },
        dispose() {
            node.removeEventListener("toggle", onToggle);
            node.removeEventListener("keydown", onKeydown);
            if (trigger) trigger.removeEventListener("click", onClick);
        },
    };
}
