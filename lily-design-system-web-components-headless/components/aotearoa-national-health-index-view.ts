// AotearoaNationalHealthIndexView component
//
// A headless read-only display of New Zealand's National Health Index (NHI) Number.
// Format: Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a
// Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from
// July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — the identifier announces as a single unit, not broken into words/chunks.
//
// References:
//   - components/aotearoa-national-health-index-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/NHI_Number

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class AotearoaNationalHealthIndexView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "aotearoa-national-health-index-view");
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
