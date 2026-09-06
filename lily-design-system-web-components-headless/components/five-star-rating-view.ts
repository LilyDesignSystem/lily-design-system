// FiveStarRatingView component
//
// A read-only <span role="img"> display of a five-star rating (0-5),
// containing 5 inner <span aria-hidden="true"> star characters (filled
// or empty). Companion: five-star-rating-picker.
//
// Attributes:
//   value — REQUIRED. Rating value (0-5), exposed via data-value on the
//     outer span and used to compute each inner star's data-filled state.
//   label — REQUIRED. Accessible description, via aria-label (e.g. "4
//     out of 5 stars").
//   ...rest — spread onto the outer <span>.
//
// References:
//   - components/five-star-rating-view/index.md (canonical contract)
//   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["value", "label"]);
const FILLED_STAR = "★"; // ★
const EMPTY_STAR = "☆"; // ☆

function renderStars(span: HTMLSpanElement, value: number): void {
    span.replaceChildren();
    for (let star = 1; star <= 5; star += 1) {
        const starSpan = document.createElement("span");
        starSpan.setAttribute("aria-hidden", "true");
        const filled = value >= star;
        starSpan.setAttribute("data-filled", String(filled));
        starSpan.textContent = filled ? FILLED_STAR : EMPTY_STAR;
        span.appendChild(starSpan);
    }
}

export class FiveStarRatingView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "five-star-rating-view");
        span.setAttribute("role", "img");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
        const value = Number(this.getAttribute("value") ?? "0");
        span.setAttribute("data-value", String(value));
        renderStars(span, value);
        passThroughAttributes(this, span, HANDLED);

        this.appendChild(span);
        this.#span = span;
    }

    get value(): number {
        return Number(this.getAttribute("value") ?? "0");
    }

    set value(v: number) {
        this.setAttribute("value", String(v));
        if (this.#span) {
            this.#span.setAttribute("data-value", String(v));
            renderStars(this.#span, v);
        }
    }
}
