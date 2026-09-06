// Emoji component
//
// A single emoji character with an accessible name, so screen readers
// announce a meaningful description instead of the raw Unicode
// character. Renders a <span role="img">.
//
// Attributes:
//   emoji — REQUIRED. The emoji character(s) to display.
//   label — REQUIRED. Accessible name describing the emoji, via
//     aria-label.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/emoji/index.md (canonical contract)
//   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["emoji", "label"]);

export class Emoji extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.emoji")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "emoji");
        span.setAttribute("role", "img");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
        span.textContent = this.getAttribute("emoji") ?? "";
        passThroughAttributes(this, span, HANDLED);

        this.appendChild(span);
    }
}
