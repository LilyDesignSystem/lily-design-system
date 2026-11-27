// Option component
//
// A native <option> for use inside a <select> (this catalog's Select
// component, or a plain native <select>). The consumer's light-DOM
// children become the option's label text.
//
// Attributes:
//   value — REQUIRED. The value submitted with the form.
//   selected, disabled — presence-based booleans.
//   ...rest — spread onto the <option>.
//
// References:
//   - components/option/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["value", "selected", "disabled"]);

export class Option extends HTMLElement {
    // A change to value, selected, disabled or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["value", "selected", "disabled", "class"];
    }

    attributeChangedCallback(): void {
        const el = this.querySelector<HTMLOptionElement>(":scope > option.option");
        if (!el) return;
        el.className = rootClassName(this, "option");
        const value = this.getAttribute("value");
        if (value !== null) el.value = value;
        else el.removeAttribute("value");
        // selected is the default, as a native option's selected attribute is.
        el.defaultSelected = this.hasAttribute("selected");
        el.disabled = this.hasAttribute("disabled");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > option.option")) return;

        const option = document.createElement("option");
        option.className = rootClassName(this, "option");
        const value = this.getAttribute("value");
        if (value !== null) option.value = value;
        if (this.hasAttribute("selected")) option.selected = true;
        if (this.hasAttribute("disabled")) option.disabled = true;
        passThroughAttributes(this, option, HANDLED);

        moveChildrenInto(this, option);
        this.appendChild(option);
    }
}
