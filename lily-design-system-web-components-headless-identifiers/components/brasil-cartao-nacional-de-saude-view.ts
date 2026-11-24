// BrasilCartaoNacionalDeSaudeView component
//
// A headless read-only display of Brazil's Cartão Nacional de Saúde (CNS).
// Format: Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN
// NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry);
// numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum
// Modulus-11 check across all 15 digits.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/brasil-cartao-nacional-de-saude-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/CPF_number

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class BrasilCartaoNacionalDeSaudeView extends HTMLElement {
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
        span.className = rootClassName(this, "brasil-cartao-nacional-de-saude-view");
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
