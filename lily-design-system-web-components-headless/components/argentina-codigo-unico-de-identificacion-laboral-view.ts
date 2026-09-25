// ArgentinaCodigoUnicoDeIdentificacionLaboralView component
//
// A headless read-only display of Argentina's Código Único de Identificación Laboral (CUIL).
// Format: XX-NNNNNNNN-X: prefix, 8-digit DNI, Modulus-11 check digit.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — the identifier announces as a single unit, not broken into words/chunks.
//
// References:
//   - components/argentina-codigo-unico-de-identificacion-laboral-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/CUIT

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class ArgentinaCodigoUnicoDeIdentificacionLaboralView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "argentina-codigo-unico-de-identificacion-laboral-view");
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
