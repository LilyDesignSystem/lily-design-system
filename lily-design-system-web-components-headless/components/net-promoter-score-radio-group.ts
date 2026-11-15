// NetPromoterScoreRadioGroup component
//
// A native <fieldset role="radiogroup"> wrapping consumer-supplied radio
// buttons (typically <label> elements wrapping <input type="radio">, or
// this catalog's NetPromoterScoreRadioInput). No internal state: mutual exclusion is
// native net-promoter-score-radio-input behaviour.
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//   ...rest — spread onto the <fieldset>.
//
// References:
//   - components/net-promoter-score-radio-group/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class NetPromoterScoreRadioGroup extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > fieldset.net-promoter-score-radio-group")) return;

        const fieldset = document.createElement("fieldset");
        fieldset.className = rootClassName(this, "net-promoter-score-radio-group");
        fieldset.setAttribute("role", "radiogroup");
        const label = this.getAttribute("label");
        if (label !== null) fieldset.setAttribute("aria-label", label);
        passThroughAttributes(this, fieldset, HANDLED);

        moveChildrenInto(this, fieldset);
        this.appendChild(fieldset);
    }
}
