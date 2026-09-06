// RadioInput component
//
// A native <input type="radio">. No visible <label> is rendered — the
// consumer supplies the accessible name via `label` (aria-label) and may
// wrap the element in their own <label> if they want visible text too.
// `checked` is not two-way bound: consumers read/write it directly or via
// event handlers, matching native radio behaviour.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   name — radio group name for mutual exclusion.
//   value — the value representing this radio option.
//   checked, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (onchange, id, …).
//
// References:
//   - components/radio-input/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "name", "value", "checked", "disabled"]);

export class RadioInput extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > input.radio-input")) return;

        const input = document.createElement("input");
        input.type = "radio";
        input.className = rootClassName(this, "radio-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        const name = this.getAttribute("name");
        if (name !== null) input.name = name;
        const value = this.getAttribute("value");
        if (value !== null) input.value = value;
        if (this.hasAttribute("checked")) input.checked = true;
        if (this.hasAttribute("disabled")) input.disabled = true;
        passThroughAttributes(this, input, HANDLED);

        this.appendChild(input);
    }
}
