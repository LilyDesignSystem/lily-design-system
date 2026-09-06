// CheckboxInput component
//
// A native <input type="checkbox"> for toggling a boolean value. No
// visible <label> is rendered — the consumer supplies the accessible
// name via `label` (aria-label).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   checked — presence-based boolean; also exposed as a live `checked`
//     property that proxies to the inner <input>.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (name, value, id, …).
//
// Keyboard: Space toggles, Tab moves focus — native <input> behaviour.
//
// References:
//   - components/checkbox-input/index.md (canonical contract)
//   - WAI-ARIA Checkbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "checked", "required", "disabled"]);

export class CheckboxInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "checkbox";
        input.className = rootClassName(this, "checkbox-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        if (this.hasAttribute("checked")) input.checked = true;
        if (this.hasAttribute("required")) input.required = true;
        if (this.hasAttribute("disabled")) input.disabled = true;
        passThroughAttributes(this, input, HANDLED);

        this.appendChild(input);
        this.#input = input;
    }

    get checked(): boolean {
        return this.#input?.checked ?? this.hasAttribute("checked");
    }

    set checked(v: boolean) {
        if (this.#input) this.#input.checked = v;
        else this.toggleAttribute("checked", v);
    }
}
