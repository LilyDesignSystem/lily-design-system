// RomaniaCodNumericPersonalView component
//
// A headless read-only display of Romania's Cod Numeric Personal (CNP).
// Format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — set on the <span> so the identifier announces as a single unit.
//
// References:
//   - components/romania-cod-numeric-personal-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Romania

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class RomaniaCodNumericPersonalView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "romania-cod-numeric-personal-view");
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
