// SelectWithExtras component
//
// A <div> wrapper around a native <select>, with optional content areas
// before and after it (e.g. a flag icon, a helper label). The custom
// element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName) — same "self is the wrapper, but
// still builds a real nested native element" shape as Banner (which
// builds a dismiss <button> under itself). Consumer `<option>` children
// are moved into the generated <select>; light-DOM children marked
// slot="before" / slot="after" (the BarChart data-table-slot
// convention) are moved to flank it instead.
//
// Attributes:
//   label — REQUIRED. Accessible label for the select, via aria-label.
//   value — initial value; also a live `value` property that proxies to
//     the inner <select>.
//   required, disabled — presence-based booleans.
//
// References:
//   - components/select-with-extras/index.md (canonical contract)
//   - HTML <select> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select

import { applySelfClassName, moveChildrenInto } from "../lib/dom-utils.js";

export class SelectWithExtras extends HTMLElement {
    #select: HTMLSelectElement | null = null;

    connectedCallback(): void {
        if (this.#select) return;

        const before = this.querySelector(':scope > [slot="before"]');
        const after = this.querySelector(':scope > [slot="after"]');
        before?.remove();
        after?.remove();

        const select = document.createElement("select");
        const label = this.getAttribute("label");
        if (label !== null) select.setAttribute("aria-label", label);
        if (this.hasAttribute("required")) select.required = true;
        if (this.hasAttribute("disabled")) select.disabled = true;

        moveChildrenInto(this, select);
        const value = this.getAttribute("value");
        if (value !== null) select.value = value;

        applySelfClassName(this, "select-with-extras");
        if (before) this.appendChild(before);
        this.appendChild(select);
        if (after) this.appendChild(after);

        this.#select = select;
    }

    get value(): string {
        return this.#select?.value ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#select) this.#select.value = v;
        else this.setAttribute("value", v);
    }
}
