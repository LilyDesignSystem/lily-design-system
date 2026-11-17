// <lily-observation-view>: a read-only clinical observation or result, with unit, flag and reference range
// (spec/healthcare-ui item 1). Renders a light-DOM <span class="observation-view">. Shows what the consumer decided;
// computes no flag and no range.
// Attributes: label, value, unit, interpretation (FHIR v3 code -> data-interpretation), flag-label, range,
//   ranges (a JSON array of { label, text }), previous-value (in a <del>) and previous-label,
//   status (final | preliminary | amended | corrected | entered-in-error | cancelled | masked | not-recorded | unavailable | not-applicable
//   -> data-status), status-label.
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

// FHIR statuses with no value to show: the consumer's words replace it (tasks.md P28-T5).
const MISSING: readonly string[] = [
    "cancelled",
    "masked",
    "not-recorded",
    "unavailable",
    "not-applicable",
];

const HANDLED = new Set([
    "label",
    "value",
    "unit",
    "interpretation",
    "flag-label",
    "range",
    "ranges",
    "previous-value",
    "previous-label",
    "status",
    "status-label",
]);

function part(name: string, text: string): HTMLSpanElement {
    const span = document.createElement("span");
    span.className = `observation-view-${name}`;
    span.textContent = text;
    return span;
}

export class ObservationView extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.observation-view")) return;
        const attr = (name: string) => this.getAttribute(name) ?? "";
        const status = attr("status") || "final";
        const span = document.createElement("span");
        span.className = rootClassName(this, "observation-view");
        if (attr("interpretation"))
            span.setAttribute("data-interpretation", attr("interpretation"));
        span.setAttribute("data-status", status);
        if (attr("label")) {
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${attr("label")} `;
            span.append(hidden);
        }
        if (MISSING.includes(status)) {
            span.append(part("status", attr("status-label")));
        } else {
            span.append(part("value", attr("value")));
            if (attr("unit")) span.append(" ", part("unit", attr("unit")));
            if (attr("flag-label")) span.append(" ", part("flag", attr("flag-label")));
            if (attr("range")) span.append(" ", part("range", attr("range")));
            // ranges: a JSON array of { label, text }, each its own -range part with a -range-label.
            let ranges: { label: string; text: string }[] = [];
            try {
                ranges = JSON.parse(attr("ranges") || "[]");
            } catch {
                ranges = [];
            }
            for (const named of ranges) {
                const range = part("range", "");
                range.append(part("range-label", named.label), " ", named.text);
                span.append(" ", range);
            }
            if (attr("previous-value")) {
                const del = document.createElement("del");
                del.className = "observation-view-previous-value";
                del.textContent = attr("previous-value");
                span.append(" ", del);
                if (attr("previous-label"))
                    span.append(" ", part("previous-label", attr("previous-label")));
            }
            if (status !== "final" && attr("status-label"))
                span.append(" ", part("status", attr("status-label")));
        }
        passThroughAttributes(this, span, HANDLED);
        this.appendChild(span);
    }
}
