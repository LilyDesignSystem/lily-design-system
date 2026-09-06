// RedOrangeYellowGreenBluePickerButton component
//
// A <button> representing one of five status levels (red, orange,
// yellow, green, blue) within a ROYGB status picker (used as a child of
// red-orange-yellow-green-blue-picker — see that component's header
// comment for why the parent is implemented as a passive radiogroup
// rather than a native <select>). Renders its `label` as both the
// visible button text and the aria-label (matching the canonical
// react/svelte/vue ports).
//
// DOCUMENTATION GAP (flagged):
// components/red-orange-yellow-green-blue-picker-button/AGENTS.md's
// Props list omits `disabled`, but the react reference implementation's
// own props interface includes it and applies it to the button. This
// implementation includes `disabled` support, matching the real
// reference behaviour rather than the incomplete doc list.
//
// Attributes:
//   value — REQUIRED. The status value this button represents ("red" |
//     "orange" | "yellow" | "green" | "blue"), exposed via data-value.
//   label — REQUIRED. Accessible name and visible text (e.g. "Yellow -
//     Caution").
//   selected — presence-based boolean, default false; always reflected
//     as an explicit aria-pressed="true"/"false".
//   disabled — presence-based boolean (see documentation gap above).
//   ...rest — spread onto the <button>.
//
// Keyboard: Tab to focus; Enter / Space to activate (native <button>).
//
// References:
//   - components/red-orange-yellow-green-blue-picker-button/index.md (canonical contract)
//   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
//   - Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["value", "label", "selected", "disabled"]);

export class RedOrangeYellowGreenBluePickerButton extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > button.red-orange-yellow-green-blue-picker-button")) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = rootClassName(this, "red-orange-yellow-green-blue-picker-button");
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
