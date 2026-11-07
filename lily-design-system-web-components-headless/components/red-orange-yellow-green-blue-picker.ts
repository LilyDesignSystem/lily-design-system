// RedOrangeYellowGreenBluePicker component
//
// A picker for a red/orange/yellow/green/blue status: a <fieldset role="radiogroup"> of native radios, one per status (red, orange, yellow, green, blue), as the
// other catalogs render it. The radios give the keys, form submission and form reset natively.
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//   `red-label`, `orange-label`, `yellow-label`, `green-label`, `blue-label` — each option's visible text. Required: there is no English default, and without one an option shows its value.
//   value — the checked status ("" = none).
//   name — radio group name for form submission, default "status".
//   disabled — presence-based boolean; disables the whole group.
//   ...rest — spread onto the <fieldset>.
//
// Property: statusLabel — (status: string) => string, an alternative to the -label attributes, set before connecting.
//
// Events: change, from the radio the user checks (it bubbles); `value` follows it.
//
// Keyboard: native radios. Tab focuses the checked radio; the arrows move and check; Space checks.
//
// References:
//   - components/red-orange-yellow-green-blue-picker/index.md (canonical contract)
//   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const STATUSES = ["red", "orange", "yellow", "green", "blue"];
const HANDLED = new Set([
    "label",
    "value",
    "name",
    "disabled",
    ...STATUSES.map((s) => `${s}-label`),
]);

export class RedOrangeYellowGreenBluePicker extends HTMLElement {
    statusLabel: ((status: string) => string) | undefined;

    connectedCallback(): void {
        if (this.querySelector(":scope > fieldset.red-orange-yellow-green-blue-picker")) return;

        const fieldset = document.createElement("fieldset");
        fieldset.className = rootClassName(this, "red-orange-yellow-green-blue-picker");
        fieldset.setAttribute("role", "radiogroup");
        const label = this.getAttribute("label");
        if (label !== null) fieldset.setAttribute("aria-label", label);
        if (this.hasAttribute("disabled")) fieldset.disabled = true;
        passThroughAttributes(this, fieldset, HANDLED);

        const name = this.getAttribute("name") ?? "status";
        const value = this.getAttribute("value") ?? "";
        for (const status of STATUSES) {
            const option = document.createElement("label");
            const input = document.createElement("input");
            input.type = "radio";
            input.name = name;
            input.value = status;
            // defaultChecked, so a form reset restores the starting value natively.
            input.defaultChecked = status === value;
            input.addEventListener("change", () => this.setAttribute("value", status));
            const text =
                this.statusLabel?.(status) ?? this.getAttribute(`${status}-label`) ?? status;
            option.append(input, ` ${text}`);
            fieldset.appendChild(option);
        }
        this.appendChild(fieldset);
    }
}
