// YisraelTeudatZehutView component
//
// A headless read-only display of Israel's Teudat Zehut (תעודת זהות).
// Format: Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10)
// check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over
// 9 has its own two digits summed, and the total must be a multiple of 10.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — the identifier announces as a single unit, not broken into words/chunks.
//
// References:
//   - components/yisrael-teudat-zehut-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Israeli_identity_card

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class YisraelTeudatZehutView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "yisrael-teudat-zehut-view");
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
