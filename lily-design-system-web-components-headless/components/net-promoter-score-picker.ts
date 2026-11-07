// NetPromoterScorePicker component
//
// A picker for a 0-10 Net Promoter Score: a <fieldset role="radiogroup"> of native radios, one per value (0 to 10), as the
// Svelte reference and the other catalogs render it (tasks.md P25-T19). The radios give the keys, form submission and
// form reset natively.
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//   value — the checked value (none by default).
//   name — radio group name for form submission, default "nps".
//   ...rest — spread onto the <fieldset>.
//
// Events: change, from the radio the user checks (it bubbles); `value` follows it.
//
// Keyboard: native radios. Tab focuses the checked radio; the arrows move and check; Space checks.
//
// References:
//   - components/net-promoter-score-picker/index.md (canonical contract)
//   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const HANDLED = new Set(["label", "value", "name"]);

export class NetPromoterScorePicker extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > fieldset.net-promoter-score-picker")) return;

        const fieldset = document.createElement("fieldset");
        fieldset.className = rootClassName(this, "net-promoter-score-picker");
        fieldset.setAttribute("role", "radiogroup");
        const label = this.getAttribute("label");
        if (label !== null) fieldset.setAttribute("aria-label", label);
        passThroughAttributes(this, fieldset, HANDLED);

        const name = this.getAttribute("name") ?? "nps";
        const value = this.getAttribute("value");
        for (const n of VALUES) {
            const option = document.createElement("label");
            const input = document.createElement("input");
            input.type = "radio";
            input.name = name;
            input.value = String(n);
            input.setAttribute("aria-label", String(n));
            // defaultChecked, so a form reset restores the starting value natively.
            input.defaultChecked = value === String(n);
            input.addEventListener("change", () => this.setAttribute("value", String(n)));
            option.append(input, ` ${String(n)}`);
            fieldset.appendChild(option);
        }
        this.appendChild(fieldset);
    }
}
