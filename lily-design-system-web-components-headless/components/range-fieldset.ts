// RangeFieldset component
//
// A two-thumb range (tasks.md P34-T1): a real <fieldset> with a visible <legend> and two
// native <input type="range"> on one scale, for the minimum and the maximum of a span of
// values. The thumbs cannot cross: a thumb moved past the other stops where the other is.
// Each value is its own form field, and a native form reset puts both back.
//
// Attributes:
//   legend — REQUIRED. The group's visible name.
//   minimum-label, maximum-label — REQUIRED. Each thumb's accessible name.
//   min (default 0), max (default 100), step (default 1) — the shared scale.
//   minimum (default min), maximum (default max) — the starting values; also live
//     `minimum` and `maximum` properties.
//   minimum-name, maximum-name — form field names.
//   disabled — disables both thumbs.
//   ...rest — spread onto the generated <fieldset>.
//
// Events:
//   change — bubbles from the native inputs; read `minimum` and `maximum` on the element.
//
// References:
//   - components/range-fieldset/index.md (canonical contract)
//   - WAI-ARIA Multi-Thumb Slider: https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set([
    "legend",
    "minimum-label",
    "maximum-label",
    "min",
    "max",
    "step",
    "minimum",
    "maximum",
    "minimum-name",
    "maximum-name",
    "disabled",
]);

export class RangeFieldset extends HTMLElement {
    #root: HTMLFieldSetElement | null = null;
    #lower: HTMLInputElement | null = null;
    #upper: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#root) return;

        const root = document.createElement("fieldset");
        root.className = rootClassName(this, "range-fieldset");
        if (this.hasAttribute("disabled")) root.disabled = true;
        passThroughAttributes(this, root, HANDLED);

        const legend = document.createElement("legend");
        legend.className = "range-fieldset-legend";
        legend.textContent = this.getAttribute("legend") ?? "";
        root.appendChild(legend);

        const min = this.getAttribute("min") ?? "0";
        const max = this.getAttribute("max") ?? "100";
        const step = this.getAttribute("step") ?? "1";
        const thumb = (part: "minimum" | "maximum", value: string): HTMLInputElement => {
            const input = document.createElement("input");
            input.className = `range-fieldset-${part}`;
            input.type = "range";
            const label = this.getAttribute(`${part}-label`);
            if (label !== null) input.setAttribute("aria-label", label);
            const name = this.getAttribute(`${part}-name`);
            if (name !== null) input.name = name;
            input.min = min;
            input.max = max;
            input.step = step;
            input.defaultValue = value;
            root.appendChild(input);
            return input;
        };
        const lower = thumb("minimum", this.getAttribute("minimum") ?? min);
        const upper = thumb("maximum", this.getAttribute("maximum") ?? max);

        lower.addEventListener("input", () => {
            if (Number(lower.value) > Number(upper.value)) lower.value = upper.value;
        });
        upper.addEventListener("input", () => {
            if (Number(upper.value) < Number(lower.value)) upper.value = lower.value;
        });

        this.appendChild(root);
        this.#root = root;
        this.#lower = lower;
        this.#upper = upper;
    }

    get minimum(): number {
        return Number(
            this.#lower?.value ?? this.getAttribute("minimum") ?? this.getAttribute("min") ?? 0,
        );
    }

    set minimum(v: number) {
        if (this.#lower) this.#lower.value = String(Math.min(v, this.maximum));
        else this.setAttribute("minimum", String(v));
    }

    get maximum(): number {
        return Number(
            this.#upper?.value ?? this.getAttribute("maximum") ?? this.getAttribute("max") ?? 100,
        );
    }

    set maximum(v: number) {
        if (this.#upper) this.#upper.value = String(Math.max(v, this.minimum));
        else this.setAttribute("maximum", String(v));
    }
}
