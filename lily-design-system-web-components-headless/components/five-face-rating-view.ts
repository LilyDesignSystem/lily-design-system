// FiveFaceRatingView component
//
// A read-only <span role="img"> display of a five-face satisfaction
// rating (1-5), showing the face label text derived from `value` and an
// optional `labels` array. Companion: five-face-rating-radio-group.
//
// Attributes:
//   value — REQUIRED. Rating value (1-5) to display, exposed via
//     data-value and used to look up the displayed face label.
//   label — REQUIRED. Accessible description, via aria-label.
//   labels — optional JSON-encoded array of 5 strings; default
//     ["1", "2", "3", "4", "5"] — the numbers, not English words, which
//     are the consumer's to supply (e.g. ["Very bad", …, "Very good"]).
//   ...rest — spread onto the <span>.
//
// References:
//   - components/five-face-rating-view/index.md (canonical contract)
//   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement } from "../lib/live-element.js";

const DEFAULT_LABELS = ["1", "2", "3", "4", "5"];
const HANDLED = new Set(["value", "label", "labels"]);

function parseLabels(raw: string | null): string[] {
    if (!raw) return DEFAULT_LABELS;
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string"))
            return parsed;
    } catch {
        /* ignore malformed JSON, fall back to defaults */
    }
    return DEFAULT_LABELS;
}

// A change to value, label, labels or class is shown (tasks.md P50-T28).
export class FiveFaceRatingView extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLSpanElement>(":scope > span.five-face-rating-view");
        const span = existing ?? document.createElement("span");
        span.className = rootClassName(this, "five-face-rating-view");
        span.setAttribute("role", "img");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
        else span.removeAttribute("aria-label");
        const value = this.getAttribute("value") ?? "";
        span.setAttribute("data-value", value);
        span.textContent = parseLabels(this.getAttribute("labels"))[Number(value) - 1] ?? "";
        if (existing) return;
        passThroughAttributes(this, span, HANDLED);
        this.appendChild(span);
    }

    get value(): number {
        return Number(this.getAttribute("value") ?? "0");
    }

    set value(v: number) {
        this.setAttribute("value", String(v));
        this.flush();
    }
}
