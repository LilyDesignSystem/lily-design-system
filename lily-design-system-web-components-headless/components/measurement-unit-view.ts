// MeasurementUnitView component
//
// A headless read-only display of a measurement unit (e.g. "kg", "lb",
// "cm", "inch") in a native <span>. Part of the Input/View pattern —
// pairs with MeasurementUnitInput.
//
// Attributes:
//   value — REQUIRED. The measurement unit to display, as text content.
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/measurement-unit-view/index.md (canonical contract)
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement, part } from "../lib/live-element.js";

const HANDLED = new Set(["label", "value"]);

// A change to label, value or class is shown (tasks.md P50-T28).
export class MeasurementUnitView extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLSpanElement>(":scope > span.measurement-unit-view");
        const span = existing ?? document.createElement("span");
        span.className = rootClassName(this, "measurement-unit-view");
        const value = this.text("value");
        span.replaceChildren();
        if (this.text("label")) span.append(part("screen-reader-span", `${this.text("label")} `));
        span.append(value);
        if (existing) return;
        passThroughAttributes(this, span, HANDLED);
        this.appendChild(span);
    }

    get value(): string {
        return this.text("value");
    }

    set value(v: string) {
        this.setAttribute("value", v);
        this.flush();
    }
}
