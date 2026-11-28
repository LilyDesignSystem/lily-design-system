// MultiSelectWithExtras component
//
// A <div> wrapper around a native <select multiple>, with optional content
// areas before and after it. Same shape as SelectWithExtras: the custom
// element stands in for the wrapper div (applySelfClassName), consumer
// <option> children move into the generated <select>, and light-DOM
// children marked slot="before" / slot="after" flank it.
//
// Attributes:
//   label — REQUIRED. Accessible name on the <select>, via aria-label.
//   value — initial selection (JSON array or comma-separated); also a live
//     `value` property of type string[]. See MultiSelect for the deviation.
//   size — optional number of visible rows.
//   required, disabled — presence-based booleans (on the <select>).
//   ...rest — stays on the wrapper (the host itself).
//
// Keyboard: native <select multiple>.
//
// References:
//   - components/multi-select-with-extras/index.md (canonical contract)

import { applySelfClassName, moveChildrenInto } from "../lib/dom-utils.js";
import { defaultValues, followSelect, parseValues, selectValues } from "../lib/list-values.js";

export class MultiSelectWithExtras extends HTMLElement {
    #select: HTMLSelectElement | null = null;

    // A change to label, value (the default choice), size, required, disabled or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["label", "value", "size", "required", "disabled", "class"];
    }

    attributeChangedCallback(name: string): void {
        const select = this.#select;
        if (!select) return;
        if (!this.classList.contains("multi-select-with-extras"))
            applySelfClassName(this, "multi-select-with-extras");
        followSelect(this, select);
        if (name === "value") defaultValues(select, parseValues(this.getAttribute("value")));
    }

    connectedCallback(): void {
        if (this.#select) return;

        const before = this.querySelector(':scope > [slot="before"]');
        const after = this.querySelector(':scope > [slot="after"]');
        before?.remove();
        after?.remove();

        const select = document.createElement("select");
        select.multiple = true;
        const label = this.getAttribute("label");
        if (label !== null) select.setAttribute("aria-label", label);
        const size = this.getAttribute("size");
        if (size !== null) select.setAttribute("size", size);
        if (this.hasAttribute("required")) select.required = true;
        if (this.hasAttribute("disabled")) select.disabled = true;

        moveChildrenInto(this, select);
        selectValues(select, parseValues(this.getAttribute("value")));

        applySelfClassName(this, "multi-select-with-extras");
        if (before) this.appendChild(before);
        this.appendChild(select);
        if (after) this.appendChild(after);

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
