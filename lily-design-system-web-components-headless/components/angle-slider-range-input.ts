// AngleSliderRangeInput component
//
// A native <input type="range"> for selecting an angle in degrees.
// aria-valuetext carries a human-readable angle (e.g. "90°"), recomputed
// live on every "input" event so it always matches what the slider
// thumb currently reports.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — default 0; also exposed as a live numeric `value` property
//     that proxies to the inner <input>.
//   min, max, step — default 0, 360, 1.
//   value-text-suffix — default "°"; suffix appended to aria-valuetext.
//   disabled — presence-based boolean.
//   ...rest — spread onto the <input> (name, id, …).
//
// Keyboard: Arrow Right/Up increases, Arrow Left/Down decreases, Home/End
// jump to min/max — all native <input type="range"> behaviour.
//
// References:
//   - components/angle-slider-range-input/index.md (canonical contract)
//   - WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "min", "max", "step", "value-text-suffix", "disabled"]);

export class AngleSliderRangeInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "range";
        input.className = rootClassName(this, "angle-slider-range-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        input.min = this.getAttribute("min") ?? "0";
        input.max = this.getAttribute("max") ?? "360";
        input.step = this.getAttribute("step") ?? "1";
        input.value = this.getAttribute("value") ?? "0";
        if (this.hasAttribute("disabled")) input.disabled = true;
        passThroughAttributes(this, input, HANDLED);
        input.addEventListener("input", this.#onInput);

        this.appendChild(input);
        this.#input = input;
        this.#updateValueText();
    }

    get value(): number {
        return Number(this.#input?.value ?? this.getAttribute("value") ?? "0");
    }

    set value(v: number) {
        if (this.#input) {
            this.#input.value = String(v);
            this.#updateValueText();
        } else {
            this.setAttribute("value", String(v));
        }
    }

    #onInput = (): void => {
        this.#updateValueText();
    };

    #updateValueText(): void {
        const input = this.#input;
        if (!input) return;
        input.setAttribute("aria-valuemin", input.min);
        input.setAttribute("aria-valuemax", input.max);
        input.setAttribute("aria-valuenow", input.value);
        const suffix = this.getAttribute("value-text-suffix") ?? "°";
        input.setAttribute("aria-valuetext", `${input.value}${suffix}`);
    }
}
