// NetPromoterScorePickerButton component
//
// A <button> representing one score (0-10) in a Net Promoter Score
// picker (used as a child of net-promoter-score-picker). Renders its
// `label` as both the visible button text and the aria-label (matching
// the canonical react/svelte/vue ports).
//
// DOCUMENTATION GAP (flagged): components/net-promoter-score-picker-button/
// AGENTS.md's Props list omits `disabled`, but the react reference
// implementation's own props interface includes it and applies it to
// the button. This implementation includes `disabled` support, matching
// the real reference behaviour rather than the incomplete doc list.
//
// Attributes:
//   value — REQUIRED. The NPS score value this button represents (e.g.
//     "0".."10"), exposed via data-value.
//   label — REQUIRED. Accessible name and visible text.
//   selected — presence-based boolean, default false; always reflected
//     as an explicit aria-pressed="true"/"false".
//   disabled — presence-based boolean (see documentation gap above).
//   ...rest — spread onto the <button>.
//
// Keyboard: Tab to focus; Enter / Space to activate (native <button>).
//
// References:
//   - components/net-promoter-score-picker-button/index.md (canonical contract)
//   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
//   - Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["value", "label", "selected", "disabled"]);

export class NetPromoterScorePickerButton extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > button.net-promoter-score-picker-button")) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = rootClassName(this, "net-promoter-score-picker-button");
        const value = this.getAttribute("value");
        if (value !== null) button.setAttribute("data-value", value);
        const label = this.getAttribute("label");
        if (label !== null) {
            button.setAttribute("aria-label", label);
            button.textContent = label;
        }
        button.setAttribute("aria-pressed", this.hasAttribute("selected") ? "true" : "false");
        if (this.hasAttribute("disabled")) button.disabled = true;
        passThroughAttributes(this, button, HANDLED);

        this.appendChild(button);
    }
}
