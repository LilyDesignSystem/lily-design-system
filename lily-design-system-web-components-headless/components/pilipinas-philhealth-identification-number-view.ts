// PilipinasPhilhealthIdentificationNumberView component
//
// A headless read-only display of the Philippines' PhilHealth Identification Number (PIN).
// Format: Twelve-digit number assigned by the Philippine Health Insurance Corporation (PhilHealth)
// to every enrolled member, commonly displayed grouped as NN-NNNNNNNNN-N. No published check-digit
// algorithm; correctness is confirmed against PhilHealth's own membership records.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — the identifier announces as a single unit, not broken into words/chunks.
//
// References:
//   - components/pilipinas-philhealth-identification-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/PhilHealth

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class PilipinasPhilhealthIdentificationNumberView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "pilipinas-philhealth-identification-number-view");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
        span.textContent = this.getAttribute("value") ?? "";
        span.setAttribute("role", "text");
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
