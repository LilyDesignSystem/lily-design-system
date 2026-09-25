// NihonKojinBangoView component
//
// A headless read-only display of Japan's Individual Number / My Number (マイナンバー).
// Format: Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check
// digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for
// positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder
// subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — the identifier announces as a single unit, not broken into words/chunks.
//
// References:
//   - components/nihon-kojin-bango-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Individual_Number

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class NihonKojinBangoView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "nihon-kojin-bango-view");
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
