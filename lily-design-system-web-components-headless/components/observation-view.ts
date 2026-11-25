// <lily-observation-view>: a read-only clinical observation or result, with unit, flag and reference range
// (spec/healthcare-ui item 1). Renders a light-DOM <span class="observation-view">. Shows what the consumer decided;
// computes no flag and no range.
// Attributes: label, value, unit, interpretation (FHIR v3 code -> data-interpretation), flag-label, range,
//   ranges (a JSON array of { label, text }), previous-value (in a <del>) and previous-label,
//   meter-value, meter-min, meter-max (all three draw an aria-hidden <meter>), meter-low, meter-high, meter-optimum,
//   status (final | preliminary | amended | corrected | entered-in-error | cancelled | masked | not-recorded | unavailable | not-applicable
//   -> data-status), status-label.
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

// FHIR statuses with no value to show: the consumer's words replace it (tasks.md P28-T5).
const MISSING: readonly string[] = [
    "registered",
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
    "meter-value",
    "meter-min",
    "meter-max",
    "meter-low",
    "meter-high",
    "meter-optimum",
    "previous-value",
    "previous-label",
    "status",
    "status-label",
    "show-withdrawn",
]);

/** The attributes that hold the result itself. */
const RECORD = [
    "value",
    "unit",
    "interpretation",
    "flag-label",
    "range",
    "ranges",
    "meter-value",
    "meter-min",
    "meter-max",
    "meter-low",
    "meter-high",
    "meter-optimum",
    "previous-value",
    "previous-label",
];

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
        const withdrawn = status === "entered-in-error";
        const withheld =
            MISSING.includes(status) ||
            (status !== "final" && !attr("status-label")) ||
            (withdrawn && !this.hasAttribute("show-withdrawn"));
        if (attr("interpretation") && !withheld && !withdrawn)
            span.setAttribute("data-interpretation", attr("interpretation"));
        span.setAttribute("data-status", status);
        if (attr("label")) {
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${attr("label")} `;
            span.append(hidden);
        }
        if (withheld) {
            span.append(part("status", attr("status-label")));
        } else if (withdrawn) {
            const del = document.createElement("del");
            del.className = "observation-view-withdrawn-value";
            del.append(part("value", attr("value")));
            if (attr("unit")) del.append(" ", part("unit", attr("unit")));
            span.append(part("status", attr("status-label")), " ", del);
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
            // A meter where the value sits, aria-hidden: the value, range and flag are already words.
            const number = (name: string): number | undefined => {
                const raw = this.getAttribute(name);
                const n = raw === null || raw === "" ? Number.NaN : Number(raw);
                return Number.isFinite(n) ? n : undefined;
            };
            const meterValue = number("meter-value");
            const meterMin = number("meter-min");
            const meterMax = number("meter-max");
            if (meterValue !== undefined && meterMin !== undefined && meterMax !== undefined) {
                const meter = document.createElement("meter");
                meter.className = "observation-view-meter";
                meter.setAttribute("aria-hidden", "true");
                meter.min = meterMin;
                meter.max = meterMax;
                meter.value = meterValue;
                const low = number("meter-low");
                const high = number("meter-high");
                const optimum = number("meter-optimum");
                if (low !== undefined) meter.low = low;
                if (high !== undefined) meter.high = high;
                if (optimum !== undefined) meter.optimum = optimum;
                span.append(" ", meter);
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
        // What is not shown does not stay in the host's attributes either. The service must still withhold it before sending.
        if (withheld || withdrawn)
            for (const name of RECORD)
                if (withheld || (name !== "value" && name !== "unit")) this.removeAttribute(name);
        this.appendChild(span);
    }
}
