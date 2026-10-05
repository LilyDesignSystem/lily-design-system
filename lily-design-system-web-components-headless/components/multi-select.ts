// MultiSelect component
//
// A native <select multiple> containing consumer-provided <option>
// children. Native keyboard and pointer behaviour only.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial selection, a JSON array (`value='["a","b"]'`) or a
//     comma-separated list. Applied after the options are moved in. Also a
//     live `value` property of type string[] (the selected option values).
//     Deviation from Svelte's bindable array: an attribute can only carry
//     text, so the live array is the property, not the attribute.
//   size — optional number of visible rows.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <select>.
//
// Keyboard: native <select multiple> (arrows, Shift/Ctrl+click, typeahead).
//
// References:
//   - components/multi-select/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { parseValues, selectValues } from "../lib/list-values.js";

const HANDLED = new Set(["label", "value", "size", "required", "disabled"]);

export class MultiSelect extends HTMLElement {
    #select: HTMLSelectElement | null = null;

    connectedCallback(): void {
        if (this.#select) return;

        const select = document.createElement("select");
        select.className = rootClassName(this, "multi-select");
        select.multiple = true;
        const label = this.getAttribute("label");
        if (label !== null) select.setAttribute("aria-label", label);
        const size = this.getAttribute("size");
        if (size !== null) select.setAttribute("size", size);
        if (this.hasAttribute("required")) select.required = true;
        if (this.hasAttribute("disabled")) select.disabled = true;
        passThroughAttributes(this, select, HANDLED);

        moveChildrenInto(this, select);
        selectValues(select, parseValues(this.getAttribute("value")));

        this.appendChild(select);
        this.#select = select;
    }

    get value(): string[] {
        if (!this.#select) return parseValues(this.getAttribute("value"));
        return Array.from(this.#select.selectedOptions).map((o) => o.value);
    }

    set value(v: string[]) {
        if (this.#select) selectValues(this.#select, v);
        else this.setAttribute("value", JSON.stringify(v));
    }
}
