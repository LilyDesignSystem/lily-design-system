// Sparkline component
//
// A <span role="img"> container for a small inline chart. The consumer
// supplies the actual visualization (SVG, canvas, etc.) as light-DOM
// children; this component contributes only the semantic container and
// the accessible name — same shape as Figure, adapted to a <span> for
// inline placement (e.g. within a table cell or a sentence).
//
// Attributes:
//   label — REQUIRED. Accessible name describing the sparkline data,
//     via aria-label.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/sparkline/index.md (canonical contract)
//   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "point-count", "minimum-points", "insufficient-label"]);

export class Sparkline extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.sparkline")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "sparkline");
        // point-count below minimum-points is not a trend: only insufficient-label, as text, and no role="img".
        const count = Number(this.getAttribute("point-count"));
        const minimum = Number(this.getAttribute("minimum-points"));
        const insufficient =
            this.hasAttribute("point-count") &&
            this.hasAttribute("minimum-points") &&
            count < minimum;
        if (insufficient) {
            span.setAttribute("data-insufficient", "");
            const words = document.createElement("span");
            words.className = "sparkline-insufficient";
            words.textContent = this.getAttribute("insufficient-label") ?? "";
            passThroughAttributes(this, span, HANDLED);
            span.append(words);
            this.replaceChildren(span);
            return;
        }
        span.setAttribute("role", "img");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
        passThroughAttributes(this, span, HANDLED);
        moveChildrenInto(this, span);
        this.appendChild(span);
    }
}
