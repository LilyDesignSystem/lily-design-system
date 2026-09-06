// PolskaNumerIdentyfikacjiPodatkowejView component
//
// A headless read-only display of Poland's Numer Identyfikacji Podatkowej (NIP).
// Format: 10 numeric digits used for tax identification.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — set on the <span> so the identifier announces as a single unit.
//
// References:
//   - components/polska-numer-identyfikacji-podatkowej-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Poland

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class PolskaNumerIdentyfikacjiPodatkowejView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "polska-numer-identyfikacji-podatkowej-view");
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
