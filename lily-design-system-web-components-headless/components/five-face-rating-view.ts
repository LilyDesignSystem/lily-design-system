// FiveFaceRatingView component
//
// A read-only <span role="img"> display of a five-face satisfaction
// rating (1-5), showing the face label text derived from `value` and an
// optional `labels` array. Companion: five-face-rating-picker.
//
// Attributes:
//   value — REQUIRED. Rating value (1-5) to display, exposed via
//     data-value and used to look up the displayed face label.
//   label — REQUIRED. Accessible description, via aria-label.
//   labels — optional JSON-encoded array of 5 strings; default
//     ["Very bad", "Bad", "Okay", "Good", "Very good"].
//   ...rest — spread onto the <span>.
//
// References:
//   - components/five-face-rating-view/index.md (canonical contract)
//   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const DEFAULT_LABELS = ["Very bad", "Bad", "Okay", "Good", "Very good"];
const HANDLED = new Set(["value", "label", "labels"]);

function parseLabels(raw: string | null): string[] {
    if (!raw) return DEFAULT_LABELS;
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) return parsed;
    } catch {
        /* ignore malformed JSON, fall back to defaults */
    }
    return DEFAULT_LABELS;
}

export class FiveFaceRatingView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "five-face-rating-view");
        span.setAttribute("role", "img");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
        const value = this.getAttribute("value") ?? "";
        span.setAttribute("data-value", value);
        const labels = parseLabels(this.getAttribute("labels"));
        span.textContent = labels[Number(value) - 1] ?? "";
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
            const labels = parseLabels(this.getAttribute("labels"));
            this.#span.textContent = labels[v - 1] ?? "";
        }
    }
}
