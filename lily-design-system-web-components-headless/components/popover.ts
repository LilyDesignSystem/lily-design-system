// Popover component
//
// A <div role="dialog"> anchored near a consumer-supplied trigger element. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName) and is itself the popover:
// popover="auto" role="dialog". The native Popover API puts it in the top layer
// while open and closes it on Escape and on a click outside it (light dismiss),
// with no script; a consumer trigger names it by id with
// command="toggle-popover" commandfor="<id>" (or popovertarget="<id>").
//
// Attributes:
//   label — REQUIRED. Accessible name for the dialog, via aria-label.
//   open — presence-based boolean; bindable. Setting it opens the popover
//     (showPopover); the browser's own toggles (trigger, Escape, light
//     dismiss) write it back, through the element's `toggle` event.
//   id — give one so a trigger can name it.
//
// Where the Popover API is missing (jsdom, old engines) the host's `hidden`
// property reflects !open instead, and Escape and focus trapping stay the
// consumer's, as before.
//
// References:
//   - components/popover/index.md (canonical contract)
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
//   - MDN Popover API: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API

import { applySelfClassName } from "../lib/dom-utils.js";

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
        node.hidden = !open;
        return;
    }
    // Showing an open popover or hiding a closed one is a no-op in current engines; older ones throw.
    try {
        if (open) node.showPopover();
        else node.hidePopover();
    } catch {
        // Already in that state, or not connected: nothing to do.
    }
}

/**
 * Keep a popover="manual" popup in step with `open` (P16-T4): with the Popover API it gets the attribute and is shown or hidden
 * in the top layer; without it, the `hidden` attribute does the job. Used by the popups that are not light-dismissed.
 */
export function syncManualPopover(node: HTMLElement, open: boolean): void {
    if (popoverSupported(node) && node.getAttribute("popover") !== "manual")
        node.setAttribute("popover", "manual");
    syncPopover(node, open);
}

/** The `toggle` event's new state, as a boolean (true when the popover opened). */
export function toggleOpened(event: Event): boolean {
    return (event as ToggleEvent).newState === "open";
}

export class Popover extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "popover");
            this.setAttribute("role", "dialog");
            if (!this.hasAttribute("popover")) this.setAttribute("popover", "auto");
            this.addEventListener("toggle", this.#onToggle);
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        syncPopover(this, this.hasAttribute("open"));
    }

    #onToggle = (event: Event): void => {
        this.toggleAttribute("open", toggleOpened(event));
    };
}
