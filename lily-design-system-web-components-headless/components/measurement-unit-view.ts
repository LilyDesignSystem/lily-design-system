// MeasurementUnitView component
//
// A headless read-only display of a measurement unit (e.g. "kg", "lb",
// "cm", "inch") in a native <span>. Part of the Input/View pattern —
// pairs with MeasurementUnitInput.
//
// Attributes:
//   value — REQUIRED. The measurement unit to display, as text content.
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/measurement-unit-view/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class MeasurementUnitView extends HTMLElement {
    #span: HTMLSpanElement | null = null;
    #text: Text | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "measurement-unit-view");
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
