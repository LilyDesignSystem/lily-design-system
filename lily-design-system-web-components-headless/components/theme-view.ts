// ThemeView component
//
// A read-only display of the current theme. Wraps a real <span>. Pairs
// with ThemeSelect (already in this catalog) in an Input/View pattern.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — REQUIRED. The current theme name, rendered as text content.
//
// References:
//   - components/theme-view/index.md (canonical contract)
//   - WAI-ARIA Accessible Name: https://www.w3.org/TR/accname-1.2/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class ThemeView extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.theme-view")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "theme-view");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
        span.textContent = this.getAttribute("value") ?? "";
        passThroughAttributes(this, span, HANDLED);

        this.replaceChildren();
        this.appendChild(span);
    }
}
