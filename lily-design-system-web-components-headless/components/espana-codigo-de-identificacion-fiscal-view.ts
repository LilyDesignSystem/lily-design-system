// EspanaCodigoDeIdentificacionFiscalView component
//
// A headless read-only display of Spain's Código de Identificación Fiscal (CIF).
// Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and
//   U are not used).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/espana-codigo-de-identificacion-fiscal-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/VAT_identification_number#Spain

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class EspanaCodigoDeIdentificacionFiscalView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "espana-codigo-de-identificacion-fiscal-view");
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
