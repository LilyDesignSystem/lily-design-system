// FiveStarRatingPickerButton component
//
// A <button> representing one star rating, for a consumer composing its own radiogroup of
// rating buttons. The five-star-rating-picker itself renders native radios and does not use it
// (tasks.md P25-T19). Renders its `label` as both the visible button text and the aria-label.
//
// DOCUMENTATION GAP (flagged): components/five-star-rating-picker-button/
// AGENTS.md's Props list omits `disabled`, but the react reference
// implementation's own props interface includes it and applies it to
// the button. This implementation includes `disabled` support, matching
// the real reference behaviour rather than the incomplete doc list.
//
// Attributes:
//   value — REQUIRED. The star rating value this button represents
//     (e.g. "1".."5"), exposed via data-value.
//   label — REQUIRED. Accessible name and visible text (e.g. "1 star",
//     "3 stars").
//   selected — presence-based boolean, default false; always reflected
//     as aria-checked="true"/"false". The button is role="radio", as in Nunjucks and
//     HTML, for a radiogroup the consumer builds; aria-pressed would leave that group
//     with no radios (tasks.md P25-T6).
//   disabled — presence-based boolean (see documentation gap above).
//   ...rest — spread onto the <button>.
//
// Keyboard: the consumer's group's; attachRadioGroup gives one tab stop and arrows that move and check.
//
// References:
//   - components/five-star-rating-picker-button/index.md (canonical contract)
//   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["value", "label", "selected", "disabled"]);

export class FiveStarRatingPickerButton extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > button.five-star-rating-picker-button")) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = rootClassName(this, "five-star-rating-picker-button");
        const value = this.getAttribute("value");
        if (value !== null) button.setAttribute("data-value", value);
        const label = this.getAttribute("label");
        if (label !== null) {
            button.setAttribute("aria-label", label);
            button.textContent = label;
        }
        button.setAttribute("role", "radio");
        button.setAttribute("aria-checked", this.hasAttribute("selected") ? "true" : "false");
        if (this.hasAttribute("disabled")) button.disabled = true;
        passThroughAttributes(this, button, HANDLED);

        this.appendChild(button);
    }
}
