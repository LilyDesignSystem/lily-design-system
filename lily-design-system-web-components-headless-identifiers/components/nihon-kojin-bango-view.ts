// NihonKojinBangoView component
//
// A headless read-only display of Japan's Individual Number / My Number (マイナンバー).
// Format: Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check
// digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for
// positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder
// subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/nihon-kojin-bango-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Individual_Number

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class NihonKojinBangoView extends HTMLElement {
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
        span.className = rootClassName(this, "nihon-kojin-bango-view");
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
