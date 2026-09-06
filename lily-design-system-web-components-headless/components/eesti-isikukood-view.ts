// EestiIsikukoodView component
//
// A headless read-only display of Estonia's Isikukood (IK).
// Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even
//   female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes
//   persons born the same day, C is a checksum.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/eesti-isikukood-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Estonia

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class EestiIsikukoodView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "eesti-isikukood-view");
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
