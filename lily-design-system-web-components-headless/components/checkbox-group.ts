// CheckboxGroup component
//
// A <fieldset role="group"> wrapping consumer-supplied checkboxes. No
// internal state: selection is handled by native checkbox behaviour: the
// native fieldset `disabled` attribute propagates to every descendant
// control for free.
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//   disabled — presence-based boolean; disables every checkbox inside.
//
// Usage:
//   <lily-checkbox-group label="Notify me by">
//     <label><input type="checkbox" name="ch" value="email"> Email</label>
//     <label><input type="checkbox" name="ch" value="sms"> SMS</label>
//   </lily-checkbox-group>
//
// References:
//   - components/checkbox-group/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "disabled"]);

export class CheckboxGroup extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > fieldset.checkbox-group")) return;

        const fieldset = document.createElement("fieldset");
        fieldset.className = rootClassName(this, "checkbox-group");
        fieldset.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) fieldset.setAttribute("aria-label", label);
        if (this.hasAttribute("disabled")) fieldset.disabled = true;
        passThroughAttributes(this, fieldset, HANDLED);

        moveChildrenInto(this, fieldset);
        this.appendChild(fieldset);
    }
}
