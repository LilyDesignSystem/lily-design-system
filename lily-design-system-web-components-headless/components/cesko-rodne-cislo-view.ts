// CeskoRodneCisloView component
//
// A headless read-only display of Czech Republic's Rodné číslo (RČ).
// Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and
//   MM+50 for females; the ten-digit form ends in a check digit and is
//   usually divisible by 11.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/cesko-rodne-cislo-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class CeskoRodneCisloView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "cesko-rodne-cislo-view");
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
