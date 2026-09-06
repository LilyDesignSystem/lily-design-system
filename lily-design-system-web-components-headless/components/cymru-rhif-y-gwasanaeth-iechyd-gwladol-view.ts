// CymruRhifYGwasanaethIechydGwladolView component
//
// A headless read-only display of Wales's Rhif y Gwasanaeth Iechyd Gwladol
// (Rhif GIG).
// Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with
//   England and the Isle of Man).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/cymru-rhif-y-gwasanaeth-iechyd-gwladol-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/NHS_number

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class CymruRhifYGwasanaethIechydGwladolView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "cymru-rhif-y-gwasanaeth-iechyd-gwladol-view");
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
