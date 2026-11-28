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

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["label", "point-count", "minimum-points", "insufficient-label"]);

export class Sparkline extends HTMLElement {
    // The consumer's graphic, kept while too few points hide it, so that it comes back when there are enough.
    #content: Node[] = [];

    // A change to label, point-count, minimum-points, insufficient-label or class is shown (tasks.md P50-T28): too few points
    // show the insufficient-label alone, enough show the graphic with role="img" again.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const span = this.querySelector<HTMLElement>(":scope > span.sparkline");
        if (span) this.#fill(span);
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > span.sparkline")) return;

        const span = document.createElement("span");
        passThroughAttributes(this, span, HANDLED);
        this.#content = Array.from(this.childNodes);
        this.replaceChildren(span);
        this.#fill(span);
    }

    #fill(span: HTMLElement): void {
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
            span.removeAttribute("role");
            span.removeAttribute("aria-label");
            const words = document.createElement("span");
            words.className = "sparkline-insufficient";
            words.textContent = this.getAttribute("insufficient-label") ?? "";
            span.replaceChildren(words);
            return;
        }
        span.removeAttribute("data-insufficient");
        span.setAttribute("role", "img");
        setOrRemove(span, "aria-label", this.getAttribute("label"));
        span.replaceChildren(...this.#content);
    }
}
