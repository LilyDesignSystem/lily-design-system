// MeasurementInstanceView component
//
// A read-only <span> display of a specific measured value (e.g. "72
// kg", "98.6 F", "120/80 mmHg"). Companion: measurement-instance-input.
//
// Attributes:
//   value — REQUIRED. The measurement value to display, as text content.
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//     (e.g. labeling "72 kg" as "Patient weight").
//   ...rest — spread onto the <span>.
//
// DEVIATION FROM ONE READING OF THE CANONICAL CONTRACT (flagged, not
// hidden): this component's own AGENTS.md Metadata says "HTML tag:
// <div>", but its own Implementation Notes ("Renders as a <span>
// element") and the static html-headless port (`<span
// class="measurement-instance-view">`) both use <span>. Followed here
// per this batch's instruction to cross-check html-headless when a
// component's own AGENTS.md is internally inconsistent.
//
// References:
//   - components/measurement-instance-view/index.md (canonical contract)
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement, part } from "../lib/live-element.js";

const HANDLED = new Set(["label", "value"]);

// A change to label, value or class is shown (tasks.md P50-T28).
export class MeasurementInstanceView extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLSpanElement>(
            ":scope > span.measurement-instance-view",
        );
        const span = existing ?? document.createElement("span");
        span.className = rootClassName(this, "measurement-instance-view");
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
