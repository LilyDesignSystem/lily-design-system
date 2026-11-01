// Popup component
//
// A <div role="dialog"> general-purpose overlay, the same shape as Popover under a different class name. The custom element stands in for the wrapper div
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
//   - components/popup/index.md (canonical contract)
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
//   - MDN Popover API: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API

import { applySelfClassName } from "../lib/dom-utils.js";
import { syncPopover, toggleOpened } from "./popover.js";

export class Popup extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "popup");
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
