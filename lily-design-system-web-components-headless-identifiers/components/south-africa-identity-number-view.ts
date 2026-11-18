// SouthAfricaIdentityNumberView component
//
// A headless read-only display of South Africa's Identity Number.
// Format: Thirteen digits in the form YYMMDDSSSSCAZ: the first six encode date of birth; the next
// four encode sex (0000-4999 female, 5000-9999 male); the eleventh digit encodes citizenship status
// (0 citizen, 1 permanent resident, 2 refugee); the twelfth is a legacy field fixed at 8 on modern
// cards; the thirteenth is a Luhn (Modulus-10) check digit over the preceding twelve.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/south-africa-identity-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/South_African_identity_card

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class SouthAfricaIdentityNumberView extends HTMLElement {
    #span: HTMLSpanElement | null = null;
    #text: Text | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "south-africa-identity-number-view");
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
