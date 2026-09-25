// HangukJuminDeungnokBeonhoView component
//
// A headless read-only display of South Korea's Resident Registration Number (주민등록번호).
// Format: Thirteen digits, displayed as NNNNNN-NNNNNNN. The first six digits encode date of birth
// (YYMMDD); the seventh digit encodes sex and birth century; digits eight through eleven encode
// place of registration; the twelfth is a sequence number; the thirteenth is a Modulus-11 check
// digit over the preceding twelve.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — the identifier announces as a single unit, not broken into words/chunks.
//
// References:
//   - components/hanguk-jumin-deungnok-beonho-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Resident_registration_number

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class HangukJuminDeungnokBeonhoView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "hanguk-jumin-deungnok-beonho-view");
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
