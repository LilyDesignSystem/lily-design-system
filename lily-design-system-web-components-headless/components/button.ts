// Button component
//
// A generic clickable button element, built on the native <button> for
// inherent keyboard and accessibility support.
//
// Attributes (read once, at connect):
//   type — "button" | "submit" | "reset", default "button".
//   disabled — presence-based boolean.
//   pressed — "true" | "false"; aria-pressed is rendered ONLY when this
//     attribute is present at all (toggle-button pattern), matching every
//     other framework's `pressed: boolean | undefined` prop.
//   label — accessible name override, rendered as aria-label.
//   ...rest — any other attribute is spread onto the inner <button>.
//
// Usage:
//   <lily-button label="Close dialog">
//     <span aria-hidden="true">×</span>
//   </lily-button>
//
// Keyboard: Tab to focus, Enter or Space to activate — all native <button>
// behaviour; this component adds no keydown handling of its own.
//
// Accessibility:
//   - Implicit button role from <button>.
//   - aria-pressed only when the pressed attribute is present.
//   - aria-label from the label attribute.
//
// References:
//   - components/button/index.md (canonical contract)
//   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["type", "disabled", "pressed", "label"]);

export class Button extends HTMLElement {
    static get observedAttributes(): string[] {
        return [];
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > button.button")) return;

        const button = document.createElement("button");
        button.className = rootClassName(this, "button");
        button.type = (this.getAttribute("type") as "button" | "submit" | "reset" | null) ?? "button";
        if (this.hasAttribute("disabled")) button.disabled = true;
        const pressed = this.getAttribute("pressed");
        if (pressed !== null) button.setAttribute("aria-pressed", pressed === "false" ? "false" : "true");
        const label = this.getAttribute("label");
        if (label !== null) button.setAttribute("aria-label", label);
        passThroughAttributes(this, button, HANDLED);

        moveChildrenInto(this, button);
        this.appendChild(button);
    }
}
