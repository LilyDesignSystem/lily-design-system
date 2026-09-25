// BharatAadhaarView component
//
// A headless read-only display of India's Aadhaar (आधार).
// Format: Twelve digits, the first of which is never 0 or 1. The twelfth digit is a check digit
// computed with the Verhoeff algorithm, a checksum that detects every single-digit error and every
// adjacent-digit transposition. Issued by the Unique Identification Authority of India (UIDAI).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — the identifier announces as a single unit, not broken into words/chunks.
//
// References:
//   - components/bharat-aadhaar-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Aadhaar

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class BharatAadhaarView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "bharat-aadhaar-view");
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
