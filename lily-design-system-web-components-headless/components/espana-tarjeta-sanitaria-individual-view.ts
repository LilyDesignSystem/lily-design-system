// EspanaTarjetaSanitariaIndividualView component
//
// A headless read-only display of an España Tarjeta Sanitaria Individual
// (TSI) unique national healthcare identifier, also known as CIP-SNS.
// Format: no fixed national format is standardised; the identifier is issued by
//   the consumer's regional health service.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/espana-tarjeta-sanitaria-individual-view/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class EspanaTarjetaSanitariaIndividualView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "espana-tarjeta-sanitaria-individual-view");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
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
