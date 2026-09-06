// FranceNumeroDIdentificationAuRepertoireView component
//
// A headless read-only display of a France numéro d'identification au
// répertoire (NIR) unique national healthcare identifier.
// Format: 13 digits plus a 2-digit key, formatted X XX XX XX XXX XXX XX (sex,
//   birth year, birth month, department, commune, order number, key).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/france-numero-d-identification-au-repertoire-view/index.md (canonical contract)
//   - https://www.ameli.fr/assure/droits-demarches/principes/numero-securite-sociale

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class FranceNumeroDIdentificationAuRepertoireView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "france-numero-d-identification-au-repertoire-view");
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
