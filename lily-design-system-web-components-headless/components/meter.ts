// Meter component
//
// A single native <meter>, with the value as fallback text content for
// browsers that render no visual gauge.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — REQUIRED. The current measured value.
//   min, max — default 0 and 100.
//   low, high, optimum — optional threshold hints.
//
// References:
//   - components/meter/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "min", "max", "low", "high", "optimum"]);

export class Meter extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > meter.meter")) return;

        const meter = document.createElement("meter");
        meter.className = rootClassName(this, "meter");
        const label = this.getAttribute("label");
        if (label !== null) meter.setAttribute("aria-label", label);
        const value = this.getAttribute("value") ?? "0";
        meter.value = Number(value);
        meter.min = Number(this.getAttribute("min") ?? "0");
        meter.max = Number(this.getAttribute("max") ?? "100");
        for (const attr of ["low", "high", "optimum"] as const) {
            const v = this.getAttribute(attr);
            if (v !== null) meter[attr] = Number(v);
        }
        meter.textContent = value;
        passThroughAttributes(this, meter, HANDLED);

        this.appendChild(meter);
    }
}
