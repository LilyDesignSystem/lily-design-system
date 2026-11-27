// RedAmberGreenView component
//
// A headless read-only display of a red/amber/green status. Companion:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
// AlbaCommunityHealthIndexView, adjusted for this component's own
// `value` default of "".
//
// Attributes:
//   label — REQUIRED. Accessible label for screen readers, via
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//   value — the RAG status to display (e.g. "red", "amber", "green"),
//     as text content. Default "".
//   ...rest — spread onto the <span>.
//
// References:
//   - components/red-amber-green-view/index.md (canonical contract)
//   - RAG Status: https://en.wikipedia.org/wiki/Traffic_light_rating_system
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement, part } from "../lib/live-element.js";

const HANDLED = new Set(["label", "value"]);

// A change to label, value or class is shown (tasks.md P50-T28).
export class RedAmberGreenView extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLSpanElement>(":scope > span.red-amber-green-view");
        const span = existing ?? document.createElement("span");
        span.className = rootClassName(this, "red-amber-green-view");
        const value = this.text("value");
        // The status as data-value, for the consumer's colour (the themes key on it).
        if (value) span.setAttribute("data-value", value);
        else span.removeAttribute("data-value");
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
