// RedAmberGreenRadioGroup component
//
// A native <fieldset role="radiogroup"> wrapping consumer-supplied radio
// buttons (typically <label> elements wrapping <input type="radio">, or
// this catalog's RedAmberGreenRadioInput). No internal state: mutual exclusion is
// native red-amber-green-radio-input behaviour.
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//   ...rest — spread onto the <fieldset>.
//
// References:
//   - components/red-amber-green-radio-group/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class RedAmberGreenRadioGroup extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > fieldset.red-amber-green-radio-group")) return;

        const fieldset = document.createElement("fieldset");
        fieldset.className = rootClassName(this, "red-amber-green-radio-group");
        fieldset.setAttribute("role", "radiogroup");
        const label = this.getAttribute("label");
        if (label !== null) fieldset.setAttribute("aria-label", label);
        passThroughAttributes(this, fieldset, HANDLED);

        moveChildrenInto(this, fieldset);
        this.appendChild(fieldset);
    }
}
