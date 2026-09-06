// ActionBarButton component
//
// One action button inside an ActionBar. A native <button> for inherent
// keyboard and accessibility support.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   type — "button" | "submit" | "reset", default "button".
//   disabled — presence-based boolean.
//   ...rest — spread onto the <button>.
//
// Keyboard: Tab to focus, Enter or Space to activate — native <button>
// behaviour.
//
// References:
//   - components/action-bar-button/index.md (canonical contract)
//   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "type", "disabled"]);

export class ActionBarButton extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > button.action-bar-button")) return;

        const button = document.createElement("button");
        button.className = rootClassName(this, "action-bar-button");
        button.type = (this.getAttribute("type") as "button" | "submit" | "reset" | null) ?? "button";
        if (this.hasAttribute("disabled")) button.disabled = true;
        const label = this.getAttribute("label");
        if (label !== null) button.setAttribute("aria-label", label);
        passThroughAttributes(this, button, HANDLED);

        moveChildrenInto(this, button);
        this.appendChild(button);
    }
}
