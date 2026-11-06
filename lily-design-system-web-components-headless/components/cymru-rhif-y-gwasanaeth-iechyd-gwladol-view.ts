// CymruRhifYGwasanaethIechydGwladolView component
//
// A headless read-only display of Wales's Rhif y Gwasanaeth Iechyd Gwladol
// (Rhif GIG).
// Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with
//   England and the Isle of Man).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
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
    #text: Text | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "cymru-rhif-y-gwasanaeth-iechyd-gwladol-view");
        const label = this.getAttribute("label");
        if (label) {
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${label} `;
            span.append(hidden);
        }
        this.#text = document.createTextNode(this.getAttribute("value") ?? "");
        span.append(this.#text);
        passThroughAttributes(this, span, HANDLED);

        this.appendChild(span);
        this.#span = span;
    }

    get value(): string {
        return this.#text?.data ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#text) this.#text.data = v;
        else this.setAttribute("value", v);
    }
}
