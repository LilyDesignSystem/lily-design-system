// IconButton component
//
// A button containing only an icon, where `label` is REQUIRED because the
// visible content (the icon) conveys nothing to assistive technology.
//
// Attributes:
//   label — REQUIRED. The entire accessible name, via aria-label.
//   type — "button" | "submit" | "reset", default "button".
//   disabled — presence-based boolean.
//   pressed — "true" | "false"; aria-pressed rendered only when present
//     (toggle-button pattern), matching Button.
//   base-class — replaces the default "icon-button" base class token
//     outright (not appended — `rootClassName` still appends the host's
//     own `class` attribute after it). A consumer with its own exact
//     class-hook contract (e.g. a picker helper whose spec requires
//     `class="{helper}-button"` with no extra "icon-button" token) sets
//     this instead of layering `class` on top of the default.
//
// Usage:
//   <lily-icon-button label="Close">
//     <svg aria-hidden="true">...</svg>
//   </lily-icon-button>
//
// References:
//   - components/icon-button/index.md (canonical contract)
//   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["type", "disabled", "pressed", "label", "base-class"]);

export class IconButton extends HTMLElement {
    connectedCallback(): void {
        const baseClass = this.getAttribute("base-class") ?? "icon-button";
        if (this.querySelector(`:scope > button.${baseClass}`)) return;

        const button = document.createElement("button");
        button.className = rootClassName(this, baseClass);
        button.type = (this.getAttribute("type") as "button" | "submit" | "reset" | null) ?? "button";
        if (this.hasAttribute("disabled")) button.disabled = true;
        const pressed = this.getAttribute("pressed");
        if (pressed !== null) button.setAttribute("aria-pressed", pressed === "false" ? "false" : "true");
        const label = this.getAttribute("label");
        if (label === null) {
            throw new Error("<lily-icon-button> requires a label attribute (WCAG 4.1.2)");
        }
        button.setAttribute("aria-label", label);
        passThroughAttributes(this, button, HANDLED);

        moveChildrenInto(this, button);
        this.appendChild(button);
    }
}
