// FiveStarRatingPicker component
//
// A picker for a 1-5 star rating: a <fieldset role="radiogroup"> of native radios, one per value (1 to 5), as the
// Svelte reference and the other catalogs render it (tasks.md P25-T19). The radios give the keys, form submission and
// form reset natively.
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//   value — the checked value (none by default).
//   name — radio group name for form submission, default "rating".
//   disabled — presence-based boolean; disables the whole group.
//   label-1 … label-5 — each option's visible text; default the number alone, no English.
//
// Property: starLabel — (star: number) => string, an alternative to the label-N attributes, set before connecting.
//   ...rest — spread onto the <fieldset>.
//
// Events: change, from the radio the user checks (it bubbles); `value` follows it.
//
// Keyboard: native radios. Tab focuses the checked radio; the arrows move and check; Space checks.
//
// References:
//   - components/five-star-rating-picker/index.md (canonical contract)
//   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const VALUES = [1, 2, 3, 4, 5];
const HANDLED = new Set(["label", "value", "name", "disabled", ...VALUES.map((n) => `label-${n}`)]);

export class FiveStarRatingPicker extends HTMLElement {
    starLabel: ((star: number) => string) | undefined;

    connectedCallback(): void {
        if (this.querySelector(":scope > fieldset.five-star-rating-picker")) return;

        const fieldset = document.createElement("fieldset");
        fieldset.className = rootClassName(this, "five-star-rating-picker");
        fieldset.setAttribute("role", "radiogroup");
        const label = this.getAttribute("label");
        if (label !== null) fieldset.setAttribute("aria-label", label);
        if (this.hasAttribute("disabled")) fieldset.disabled = true;
        passThroughAttributes(this, fieldset, HANDLED);

        const name = this.getAttribute("name") ?? "rating";
        const value = this.getAttribute("value");
        for (const n of VALUES) {
            const option = document.createElement("label");
            const input = document.createElement("input");
            input.type = "radio";
            input.name = name;
            input.value = String(n);
            // defaultChecked, so a form reset restores the starting value natively.
            input.defaultChecked = value === String(n);
            input.addEventListener("change", () => this.setAttribute("value", String(n)));
            option.append(
                input,
                ` ${this.starLabel?.(n) ?? this.getAttribute(`label-${n}`) ?? String(n)}`,
            );
            fieldset.appendChild(option);
        }
        this.appendChild(fieldset);
    }
}
