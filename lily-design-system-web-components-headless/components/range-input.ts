// RangeInput component
//
// A native <input type="range"> slider for selecting a numeric value
// within a range. Same shape as TextInput, plus min/max/step.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value, default "50"; also a live `value` property.
//   min — default "0".
//   max — default "100".
//   step — default "1".
//   disabled — presence-based boolean.
//   ...rest — spread onto the <input>.
//
// Keyboard: Left/Down decrease one step, Right/Up increase one step, Home
// jumps to min, End jumps to max, PageDown/PageUp use a browser-defined
// larger step — all native <input type="range"> behaviour, no JS needed.
//
// References:
//   - components/range-input/index.md (canonical contract)
//   - WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "min", "max", "step", "disabled"]);

export class RangeInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "range";
        input.className = rootClassName(this, "range-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        input.value = this.getAttribute("value") ?? "50";
        input.min = this.getAttribute("min") ?? "0";
        input.max = this.getAttribute("max") ?? "100";
        input.step = this.getAttribute("step") ?? "1";
        if (this.hasAttribute("disabled")) input.disabled = true;
        passThroughAttributes(this, input, HANDLED);

        this.appendChild(input);
        this.#input = input;
    }

    get value(): string {
        return this.#input?.value ?? this.getAttribute("value") ?? "50";
    }

    set value(v: string) {
        if (this.#input) this.#input.value = v;
        else this.setAttribute("value", v);
    }
}
