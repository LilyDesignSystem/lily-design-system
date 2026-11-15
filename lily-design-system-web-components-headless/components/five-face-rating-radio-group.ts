// FiveFaceRatingRadioGroup component
//
// A native <fieldset role="radiogroup"> wrapping consumer-supplied radio
// buttons (typically <label> elements wrapping <input type="radio">, or
// this catalog's FiveFaceRatingRadioInput). No internal state: mutual exclusion is
// native five-face-rating-radio-input behaviour.
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//   ...rest — spread onto the <fieldset>.
//
// References:
//   - components/five-face-rating-radio-group/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class FiveFaceRatingRadioGroup extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > fieldset.five-face-rating-radio-group")) return;

        const fieldset = document.createElement("fieldset");
        fieldset.className = rootClassName(this, "five-face-rating-radio-group");
        fieldset.setAttribute("role", "radiogroup");
        const label = this.getAttribute("label");
        if (label !== null) fieldset.setAttribute("aria-label", label);
        passThroughAttributes(this, fieldset, HANDLED);

        moveChildrenInto(this, fieldset);
        this.appendChild(fieldset);
    }
}
