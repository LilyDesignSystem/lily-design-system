// Select component
//
// A native <select> dropdown containing consumer-provided <option>
// children.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial selected value, applied after the option children
//     have been moved in (so it can actually match one); also a live
//     `value` property.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <select>.
//
// Keyboard: Tab to focus, Space/Enter to open, Arrow Up/Down to navigate,
// Escape to close, Home/End to jump, type-ahead — all native <select>
// behaviour, no JS needed.
//
// References:
//   - components/select/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled"]);

export class Select extends HTMLElement {
    #select: HTMLSelectElement | null = null;

    connectedCallback(): void {
        if (this.#select) return;

        const select = document.createElement("select");
        select.className = rootClassName(this, "select");
        const label = this.getAttribute("label");
        if (label !== null) select.setAttribute("aria-label", label);
        if (this.hasAttribute("required")) select.required = true;
        if (this.hasAttribute("disabled")) select.disabled = true;
        passThroughAttributes(this, select, HANDLED);

        // Move the consumer's <option> children in BEFORE setting value —
        // a <select>'s value can only match an <option> that already exists.
        moveChildrenInto(this, select);
        const value = this.getAttribute("value");
        if (value !== null) select.value = value;

        this.appendChild(select);
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
