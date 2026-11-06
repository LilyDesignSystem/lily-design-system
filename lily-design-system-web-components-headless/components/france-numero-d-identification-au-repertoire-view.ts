// FranceNumeroDIdentificationAuRepertoireView component
//
// A headless read-only display of a France numéro d'identification au
// répertoire (NIR) unique national healthcare identifier.
// Format: 13 digits plus a 2-digit key, formatted X XX XX XX XXX XXX XX (sex,
//   birth year, birth month, department, commune, order number, key).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
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
    #text: Text | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "france-numero-d-identification-au-repertoire-view");
        const label = this.getAttribute("label");
        if (label) {
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${label} `;
            span.append(hidden);
        }
        this.#text = document.createTextNode(this.getAttribute("value") ?? "");
        span.append(this.#text);
        passThroughAttributes(this, span, HANDLED);

        this.appendChild(span);
        this.#span = span;
    }

    get value(): string {
        return this.#text?.data ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#text) this.#text.data = v;
        else this.setAttribute("value", v);
    }
}
