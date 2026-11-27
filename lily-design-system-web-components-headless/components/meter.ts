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
import { LiveElement, setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["label", "value", "min", "max", "low", "high", "optimum"]);

// A change to its attributes, or to class, is shown (tasks.md P50-T28).
export class Meter extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLMeterElement>(":scope > meter.meter");
        const meter = existing ?? document.createElement("meter");
        meter.className = rootClassName(this, "meter");
        setOrRemove(meter, "aria-label", this.getAttribute("label"));
        const value = this.getAttribute("value") ?? "0";
        // min and max first, so a value outside the old range is not clamped to it.
        meter.min = Number(this.getAttribute("min") ?? "0");
        meter.max = Number(this.getAttribute("max") ?? "100");
        meter.value = Number(value);
        for (const attr of ["low", "high", "optimum"] as const) {
            const v = this.getAttribute(attr);
            if (v !== null) meter[attr] = Number(v);
            else meter.removeAttribute(attr);
        }
        meter.textContent = value;
        if (existing) return;
        passThroughAttributes(this, meter, HANDLED);
        this.appendChild(meter);
    }
}
