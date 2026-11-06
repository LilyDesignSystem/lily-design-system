// MeasurementInstanceView component
//
// A read-only <span> display of a specific measured value (e.g. "72
// kg", "98.6 F", "120/80 mmHg"). Companion: measurement-instance-input.
//
// Attributes:
//   value — REQUIRED. The measurement value to display, as text content.
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//     (e.g. labeling "72 kg" as "Patient weight").
//   ...rest — spread onto the <span>.
//
// DEVIATION FROM ONE READING OF THE CANONICAL CONTRACT (flagged, not
// hidden): this component's own AGENTS.md Metadata says "HTML tag:
// <div>", but its own Implementation Notes ("Renders as a <span>
// element") and the static html-headless port (`<span
// class="measurement-instance-view">`) both use <span>. Followed here
// per this batch's instruction to cross-check html-headless when a
// component's own AGENTS.md is internally inconsistent.
//
// References:
//   - components/measurement-instance-view/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["value", "label"]);

export class MeasurementInstanceView extends HTMLElement {
    #span: HTMLSpanElement | null = null;
    #text: Text | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "measurement-instance-view");
        const label = this.getAttribute("label");
        if (label) {
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${label} `;
            span.append(hidden);
        }
        this.#text = document.createTextNode(this.getAttribute("value") ?? "");
        span.append(this.#text);
        passThroughAttributes(this, span, HANDLED);

        this.appendChild(span);
        this.#span = span;
    }

    get value(): string {
        return this.#text?.data ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#text) this.#text.data = v;
        else this.setAttribute("value", v);
    }
}
