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

const HANDLED = new Set(["variant", "label"]);

export class StatusLight extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.status-light")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "status-light");
        span.setAttribute("data-variant", this.getAttribute("variant") ?? "neutral");
        span.setAttribute("role", "status");
        passThroughAttributes(this, span, HANDLED);

        const dot = document.createElement("span");
        dot.className = "status-light-dot";
        dot.setAttribute("aria-hidden", "true");
        span.appendChild(dot);

        const label = document.createElement("span");
        label.className = "status-light-label";
        label.textContent = this.getAttribute("label") ?? "";
        span.appendChild(label);

        this.appendChild(span);
    }
}
