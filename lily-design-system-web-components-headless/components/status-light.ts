// StatusLight component
//
// A small colored dot status indicator paired with a status label. Wraps
// a real <span role="status">; the consumer's variant selects a data
// attribute for styling, and the label is always the accessible content
// (the dot is aria-hidden — colour alone is never the indicator, WCAG
// 1.4.1).
//
// Attributes:
//   variant — "neutral" | "informative" | "positive" | "notice" |
//     "negative" | "active" | "inactive", default "neutral". Exposed as
//     data-variant.
//   label — REQUIRED. Status text (e.g. "Active", "Offline").
//
// References:
//   - components/status-light/index.md (canonical contract)
//   - Adobe Spectrum Status Light: https://spectrum.adobe.com/page/status-light/
//   - WCAG 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement, part } from "../lib/live-element.js";

const HANDLED = new Set(["variant", "label"]);

// A change to its attributes, or to class, is shown (tasks.md P50-T28).
export class StatusLight extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLSpanElement>(":scope > span.status-light");
        const span = existing ?? document.createElement("span");
        span.className = rootClassName(this, "status-light");
        span.setAttribute("data-variant", this.getAttribute("variant") ?? "neutral");
        span.setAttribute("role", "status");
        if (existing) {
            const label = span.querySelector(":scope > .status-light-label");
            if (label) label.textContent = this.text("label");
            return;
        }
        passThroughAttributes(this, span, HANDLED);
        const dot = document.createElement("span");
        dot.className = "status-light-dot";
        dot.setAttribute("aria-hidden", "true");
        span.appendChild(dot);
        span.appendChild(part("status-light-label", this.text("label")));
        this.appendChild(span);
    }
}
