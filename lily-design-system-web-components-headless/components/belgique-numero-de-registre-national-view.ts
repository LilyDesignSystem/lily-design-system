// BelgiqueNumeroDeRegistreNationalView component
//
// A headless read-only display of Belgium's Numéro de Registre National /
// Rijksregisternummer (NRN).
// Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3
//   are an ordering number (uneven for men, even for women) and the last
//   2 a check digit.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/belgique-numero-de-registre-national-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Belgium

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class BelgiqueNumeroDeRegistreNationalView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "belgique-numero-de-registre-national-view");
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
