// RedOrangeYellowGreenBlueView component
//
// A headless read-only display of a five-level (red/orange/yellow/
// green/blue) status. Companion: red-orange-yellow-green-blue-radio-group.
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// Attributes:
//   label — REQUIRED. Accessible label for screen readers, via
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//   value — the ROYGB status to display (e.g. "red", "orange",
//     "yellow", "green", "blue"), as text content. Default "".
//   ...rest — spread onto the <span>.
//
// References:
//   - components/red-orange-yellow-green-blue-view/index.md (canonical contract)
//   - Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement, part } from "../lib/live-element.js";

const HANDLED = new Set(["label", "value"]);

// A change to label, value or class is shown (tasks.md P50-T28).
export class RedOrangeYellowGreenBlueView extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLSpanElement>(
            ":scope > span.red-orange-yellow-green-blue-view",
        );
        const span = existing ?? document.createElement("span");
        span.className = rootClassName(this, "red-orange-yellow-green-blue-view");
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
