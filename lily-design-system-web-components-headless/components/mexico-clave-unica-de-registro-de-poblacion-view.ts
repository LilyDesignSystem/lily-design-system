// MexicoClaveUnicaDeRegistroDePoblacionView component
//
// A headless read-only display of Mexico's Clave Única de Registro de Población (CURP).
// Format: Eighteen-character alphanumeric code built from name, date of birth, sex, and state of
// birth: first letter of the first surname plus its first internal vowel; first letter of the
// second surname (or X if none); first letter of the given name; six-digit date of birth (YYMMDD);
// H or M for sex (X for non-binary); a two-letter state code (NE for those born abroad); a
// consonant from each surname and the given name; then two further disambiguating characters. No
// trailing check digit.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — the identifier announces as a single unit, not broken into words/chunks.
//
// References:
//   - components/mexico-clave-unica-de-registro-de-poblacion-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Unique_Population_Registry_Code

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class MexicoClaveUnicaDeRegistroDePoblacionView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "mexico-clave-unica-de-registro-de-poblacion-view");
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
