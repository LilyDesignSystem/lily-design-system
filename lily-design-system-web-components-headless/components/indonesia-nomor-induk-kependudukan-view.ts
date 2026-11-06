// IndonesiaNomorIndukKependudukanView component
//
// A headless read-only display of Indonesia's Nomor Induk Kependudukan (NIK).
// Format: Sixteen digits: region, date of birth (+40 to day for females), serial. No check digit.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/indonesia-nomor-induk-kependudukan-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Indonesia

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class IndonesiaNomorIndukKependudukanView extends HTMLElement {
    #span: HTMLSpanElement | null = null;
    #text: Text | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "indonesia-nomor-induk-kependudukan-view");
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
