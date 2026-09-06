// KyprosNationalPassportNumberView component
//
// A headless read-only display of Kypros's National Passport Number.
// Format: passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g.
//   E123456); biometric passports issued after 13/12/2010 begin with 'K'
//   followed by 8 digits (e.g. K12345678).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/kypros-national-passport-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Cypriot_passport

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class KyprosNationalPassportNumberView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "kypros-national-passport-number-view");
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
