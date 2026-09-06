// ButtonInput component
//
// A native <input type="button"> for form actions. Distinguished from
// Button, which uses <button> with a children slot: this component's
// visible label is plain text carried by the `value` attribute, matching
// native <input type="button"> semantics.
//
// Attributes:
//   value — REQUIRED. The button label text displayed on the input.
//   label — optional accessible-name override via aria-label; when
//     provided, screen readers announce this instead of the value text.
//   disabled — presence-based boolean.
//   ...rest — spread onto the <input> (name, onclick, …).
//
// References:
//   - components/button-input/index.md (canonical contract)
//   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["value", "disabled", "label"]);

export class ButtonInput extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > input.button-input")) return;

        const input = document.createElement("input");
        input.type = "button";
        input.className = rootClassName(this, "button-input");
        const value = this.getAttribute("value");
        if (value !== null) input.value = value;
        if (this.hasAttribute("disabled")) input.disabled = true;
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        passThroughAttributes(this, input, HANDLED);

        this.appendChild(input);
    }
}
