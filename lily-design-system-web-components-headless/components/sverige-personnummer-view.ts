// SverigePersonnummerView component
//
// A headless read-only display of Sweden's Personnummer.
// Format: 12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — set on the <span> so the identifier announces as a single unit.
//
// References:
//   - components/sverige-personnummer-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class SverigePersonnummerView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "sverige-personnummer-view");
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
