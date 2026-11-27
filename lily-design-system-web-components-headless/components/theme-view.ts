// ThemeView component
//
// A read-only display of the current theme. Wraps a real <span>. Pairs
// with ThemeSelect (already in this catalog) in an Input/View pattern.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — REQUIRED. The current theme name, rendered as text content.
//
// References:
//   - components/theme-view/index.md (canonical contract)
//   - WAI-ARIA Accessible Name: https://www.w3.org/TR/accname-1.2/
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement, part } from "../lib/live-element.js";

const HANDLED = new Set(["label", "value"]);

// A change to label, value or class is shown (tasks.md P50-T28).
export class ThemeView extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLSpanElement>(":scope > span.theme-view");
        const span = existing ?? document.createElement("span");
        span.className = rootClassName(this, "theme-view");
        const value = this.text("value");
        span.replaceChildren();
        if (this.text("label")) span.append(part("screen-reader-span", `${this.text("label")} `));
        span.append(value);
        if (existing) return;
        passThroughAttributes(this, span, HANDLED);
        this.replaceChildren(span);
    }
}
