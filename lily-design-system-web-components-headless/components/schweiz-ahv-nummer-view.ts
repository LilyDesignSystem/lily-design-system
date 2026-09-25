// SchweizAhvNummerView component
//
// A headless read-only display of Switzerland's AHV-Nummer / Numéro AVS.
// Format: Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix
// 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over
// the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit
// AHV card number on 1 July 2008.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — the identifier announces as a single unit, not broken into words/chunks.
//
// References:
//   - components/schweiz-ahv-nummer-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Data_codes_for_Switzerland

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class SchweizAhvNummerView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "schweiz-ahv-nummer-view");
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
