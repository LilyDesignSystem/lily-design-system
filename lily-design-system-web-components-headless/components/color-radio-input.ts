// ColorRadioInput component
//
// A native <input type="radio">. No visible <label> is rendered — the
// consumer supplies the accessible name via `label` (aria-label) and may
// wrap the element in their own <label> if they want visible text too.
// `checked` is not two-way bound: consumers read/write it directly or via
// event handlers, matching native radio behaviour.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   name — radio group name for mutual exclusion.
//   value — the value representing this radio option.
//   checked, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (onchange, id, …).
//
// References:
//   - components/color-radio-input/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["color", "label", "name", "value", "checked", "disabled"]);

export class ColorRadioInput extends HTMLElement {
    // A change to its attributes, or to class, is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const el = this.querySelector<HTMLInputElement>(":scope > input.color-radio-input");
        if (!el) return;
        el.className = rootClassName(this, "color-radio-input");
        setOrRemove(el, "aria-label", this.getAttribute("label"));
        setOrRemove(el, "name", this.getAttribute("name"));
        const color = this.getAttribute("color");
        if (color !== null) {
            el.dataset.color = color;
            el.style.setProperty("--color-radio-input-color", color);
        } else {
            delete el.dataset.color;
            el.style.removeProperty("--color-radio-input-color");
        }
        const value = this.getAttribute("value") ?? color;
        if (value !== null) el.value = value;
        el.defaultChecked = this.hasAttribute("checked");
        el.disabled = this.hasAttribute("disabled");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > input.color-radio-input")) return;

        const input = document.createElement("input");
        input.type = "radio";
        input.className = rootClassName(this, "color-radio-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        const name = this.getAttribute("name");
        if (name !== null) input.name = name;
        const value = this.getAttribute("value");
        const color = this.getAttribute("color");
        if (color !== null) {
            input.dataset.color = color;
            input.style.setProperty("--color-radio-input-color", color);
        }
        if (value !== null) input.value = value;
        else if (color !== null) input.value = color;
        // defaultChecked, not checked: a form reset restores the radio to its default.
        if (this.hasAttribute("checked")) input.defaultChecked = true;
        if (this.hasAttribute("disabled")) input.disabled = true;
        passThroughAttributes(this, input, HANDLED);

        this.appendChild(input);
    }
}
