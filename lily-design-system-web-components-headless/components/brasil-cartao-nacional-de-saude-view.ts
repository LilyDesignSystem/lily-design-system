// BrasilCartaoNacionalDeSaudeView component
//
// A headless read-only display of Brazil's Cartão Nacional de Saúde (CNS).
// Format: Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN
// NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry);
// numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum
// Modulus-11 check across all 15 digits.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — the identifier announces as a single unit, not broken into words/chunks.
//
// References:
//   - components/brasil-cartao-nacional-de-saude-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/CPF_number

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class BrasilCartaoNacionalDeSaudeView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "brasil-cartao-nacional-de-saude-view");
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
