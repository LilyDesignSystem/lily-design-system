// MeasurementSystemView component
//
// A read-only <span> display of a measurement system name (e.g.
// "metric", "imperial", "SI"). Companion: measurement-system-input.
//
// Attributes:
//   value — REQUIRED. The measurement system name to display, as text
//     content.
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//     (e.g. labeling "SI" as "International System of Units").
//   ...rest — spread onto the <span>.
//
// DEVIATION FROM ONE READING OF THE CANONICAL CONTRACT (flagged, not
// hidden): this component's own AGENTS.md Metadata says "HTML tag:
// <div>", but its own Implementation Notes ("Renders as a <span>
// element") and the static html-headless port (`<span
// class="measurement-system-view">`) both use <span>. Followed here per
// this batch's instruction to cross-check html-headless when a
// component's own AGENTS.md is internally inconsistent.
//
// References:
//   - components/measurement-system-view/index.md (canonical contract)
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement, part } from "../lib/live-element.js";

const HANDLED = new Set(["label", "value"]);

// A change to label, value or class is shown (tasks.md P50-T28).
export class MeasurementSystemView extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLSpanElement>(
            ":scope > span.measurement-system-view",
        );
        const span = existing ?? document.createElement("span");
        span.className = rootClassName(this, "measurement-system-view");
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
