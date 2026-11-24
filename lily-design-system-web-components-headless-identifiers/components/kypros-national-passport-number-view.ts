// KyprosNationalPassportNumberView component
//
// A headless read-only display of Kypros's National Passport Number.
// Format: passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g.
//   E123456); biometric passports issued after 13/12/2010 begin with 'K'
//   followed by 8 digits (e.g. K12345678).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/kypros-national-passport-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Cypriot_passport

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class KyprosNationalPassportNumberView extends HTMLElement {
    #span: HTMLSpanElement | null = null;
    #text: Text | null = null;
    // HC-I2 (spec/healthcare-ui/requirements.md): the identifier is kept in text only. A value attribute is read, then
    // removed, so a session-replay tool that records attributes never sees it; before connection it waits here.
    #pending: string | null = null;

    static get observedAttributes(): string[] {
        return ["value"];
    }

    attributeChangedCallback(name: string, _old: string | null, next: string | null): void {
        if (name !== "value" || next === null || !this.#text) return;
        this.#text.data = next;
        this.removeAttribute("value");
    }

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "kypros-national-passport-number-view");
        const label = this.getAttribute("label");
        if (label) {
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${label} `;
            span.append(hidden);
        }
        this.#text = document.createTextNode(this.#pending ?? this.getAttribute("value") ?? "");
        this.#pending = null;
        span.append(this.#text);
        passThroughAttributes(this, span, HANDLED);
        this.removeAttribute("value");

        this.appendChild(span);
        this.#span = span;
    }

    get value(): string {
        return this.#text?.data ?? this.#pending ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#text) this.#text.data = v;
        else this.#pending = v;
    }
}
