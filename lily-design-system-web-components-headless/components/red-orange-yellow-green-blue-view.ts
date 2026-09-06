// RedOrangeYellowGreenBlueView component
//
// A headless read-only display of a five-level (red/orange/yellow/
// green/blue) status. Companion: red-orange-yellow-green-blue-picker.
// Same `<span aria-label>` display shape as RedAmberGreenView.
//
// Attributes:
//   label — REQUIRED. Accessible label for screen readers, via
//     aria-label.
//   value — the ROYGB status to display (e.g. "red", "orange",
//     "yellow", "green", "blue"), as text content. Default "".
//   ...rest — spread onto the <span>.
//
// References:
//   - components/red-orange-yellow-green-blue-view/index.md (canonical contract)
//   - Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class RedOrangeYellowGreenBlueView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "red-orange-yellow-green-blue-view");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
        span.textContent = this.getAttribute("value") ?? "";
        passThroughAttributes(this, span, HANDLED);

        this.appendChild(span);
        this.#span = span;
    }

    get value(): string {
        return this.#span?.textContent ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#span) this.#span.textContent = v;
        else this.setAttribute("value", v);
    }
}
