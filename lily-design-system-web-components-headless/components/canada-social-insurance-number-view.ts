// CanadaSocialInsuranceNumberView component
//
// A headless read-only display of Canada's Social Insurance Number (SIN).
// Format: Nine digits, usually displayed in three groups of three (NNN NNN NNN). The leading digit
// denotes the region of registration (1 Atlantic, 2-3 Quebec, 4-5 Ontario, 6 Prairies, 7 Pacific, 9
// temporary residents), the following seven digits are a serial number, and the final digit is a
// Luhn (Modulus-10) check digit over the first eight.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — the identifier announces as a single unit, not broken into words/chunks.
//
// References:
//   - components/canada-social-insurance-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Social_Insurance_Number

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class CanadaSocialInsuranceNumberView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "canada-social-insurance-number-view");
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
