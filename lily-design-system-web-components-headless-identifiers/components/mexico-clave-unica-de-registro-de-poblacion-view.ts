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
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/mexico-clave-unica-de-registro-de-poblacion-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Unique_Population_Registry_Code

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class MexicoClaveUnicaDeRegistroDePoblacionView extends HTMLElement {
    #span: HTMLSpanElement | null = null;
    #text: Text | null = null;
    // HC-I2 (spec/healthcare-ui/requirements.md): the identifier is kept in text only. A value attribute is read, then
    // removed, so a session-replay tool that records attributes never sees it; before connection it waits here.
    #pending: string | null = null;

    static get observedAttributes(): string[] {
        return ["value"];
    }

    attributeChangedCallback(name: string, _old: string | null, next: string | null): void {
        if (name !== "value" || next === null || !this.#text) return;
        this.#text.data = next;
        this.removeAttribute("value");
    }

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "mexico-clave-unica-de-registro-de-poblacion-view");
        const label = this.getAttribute("label");
        if (label) {
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${label} `;
            span.append(hidden);
        }
        this.#text = document.createTextNode(this.#pending ?? this.getAttribute("value") ?? "");
        this.#pending = null;
        span.append(this.#text);
        passThroughAttributes(this, span, HANDLED);
        this.removeAttribute("value");

        this.appendChild(span);
        this.#span = span;
    }

    get value(): string {
        return this.#text?.data ?? this.#pending ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#text) this.#text.data = v;
        else this.#pending = v;
    }
}
