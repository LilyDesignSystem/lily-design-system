// BulgariaEdinenGrazhdanskiNomerView component
//
// A headless read-only display of Bulgaria's Единен граждански номер /
// Edinen grazhdanski nomer (EGN).
// Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3
//   encode area and birth order (ninth digit even for boy, odd for girl),
//   and the tenth is a check digit.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/bulgaria-edinen-grazhdanski-nomer-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Unique_citizenship_number

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class BulgariaEdinenGrazhdanskiNomerView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "bulgaria-edinen-grazhdanski-nomer-view");
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
