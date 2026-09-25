// OsterreichSozialversicherungsnummerView component
//
// A headless read-only display of Austria's Sozialversicherungsnummer (SVNR).
// Format: Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — the identifier announces as a single unit, not broken into words/chunks.
//
// References:
//   - components/osterreich-sozialversicherungsnummer-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Austria

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class OsterreichSozialversicherungsnummerView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "osterreich-sozialversicherungsnummer-view");
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
