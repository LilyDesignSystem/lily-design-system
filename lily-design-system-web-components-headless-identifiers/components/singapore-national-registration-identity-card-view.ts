// SingaporeNationalRegistrationIdentityCardView component
//
// A headless read-only display of Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN).
// Format: One letter (S or T for citizens/permanent residents; F or G for long-term foreign
// residents; M for newer FIN series), seven digits, and a trailing check letter. The check letter
// is computed by multiplying the seven digits by fixed weights (2,7,6,5,4,3,2), summing the
// products (adding 4 for a G/T prefix or 3 for an M prefix), taking the sum Modulus 11, and mapping
// (10 - remainder) through a lookup table to a letter.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/singapore-national-registration-identity-card-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_Registration_Identity_Card

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class SingaporeNationalRegistrationIdentityCardView extends HTMLElement {
    #span: HTMLSpanElement | null = null;
    #text: Text | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "singapore-national-registration-identity-card-view");
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
