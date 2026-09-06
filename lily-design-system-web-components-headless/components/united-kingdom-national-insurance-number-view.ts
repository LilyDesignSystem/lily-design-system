// UnitedKingdomNationalInsuranceNumberView component
//
// A headless read-only display of United Kingdom's National Insurance Number (NINO).
// Format: two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A; the letters D, F, I, Q, U, V and the prefix-2 letter O are excluded.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — set on the <span> so the identifier announces as a single unit.
//
// References:
//   - components/united-kingdom-national-insurance-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_Insurance_number

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class UnitedKingdomNationalInsuranceNumberView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "united-kingdom-national-insurance-number-view");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
        span.setAttribute("role", "text");
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
