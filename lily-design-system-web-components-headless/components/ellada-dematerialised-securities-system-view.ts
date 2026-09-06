// ElladaDematerialisedSecuritiesSystemView component
//
// A headless read-only display of Greece's Dematerialised Securities System (DSS).
// Format: 10 digits linked to the investor's personal details (name, ID number,
//   passport number, tax registration number) and managed by the Central
//   Securities Depository of Greece.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/ellada-dematerialised-securities-system-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Central_Securities_Depository

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class ElladaDematerialisedSecuritiesSystemView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "ellada-dematerialised-securities-system-view");
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
