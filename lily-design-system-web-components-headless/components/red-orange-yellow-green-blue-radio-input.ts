// RedOrangeYellowGreenBlueRadioInput component
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
//   - components/red-orange-yellow-green-blue-radio-input/index.md (canonical contract)

import { passThroughAttributes, rootClassName, followChoice } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "name", "value", "checked", "disabled"]);

export class RedOrangeYellowGreenBlueRadioInput extends HTMLElement {
    // A change to label, name, value, checked (the default), disabled or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        followChoice(
            this,
            "input.red-orange-yellow-green-blue-radio-input",
            "red-orange-yellow-green-blue-radio-input",
        );
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > input.red-orange-yellow-green-blue-radio-input")) return;

        const input = document.createElement("input");
        input.type = "radio";
        input.className = rootClassName(this, "red-orange-yellow-green-blue-radio-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        const name = this.getAttribute("name");
        if (name !== null) input.name = name;
        const value = this.getAttribute("value");
        if (value !== null) {
            input.value = value;
            input.dataset.value = value;
        }
        // defaultChecked, not checked: a form reset restores the radio to its default.
        if (this.hasAttribute("checked")) input.defaultChecked = true;
        if (this.hasAttribute("disabled")) input.disabled = true;
        passThroughAttributes(this, input, HANDLED);

        this.appendChild(input);
    }
}
