// NetPromoterScoreView component
//
// A headless read-only display of a Net Promoter Score (NPS) in a native
// <span>. Part of the Input/View pattern — pairs with
// NetPromoterScorePicker. No score validation or classification logic;
// consumers handle categorization and styling.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the NPS score to display, as text content. Defaults to "".
//   ...rest — spread onto the <span>.
//
// References:
//   - components/net-promoter-score-view/index.md (canonical contract)
//   - Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class NetPromoterScoreView extends HTMLElement {
    #span: HTMLSpanElement | null = null;
    #text: Text | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "net-promoter-score-view");
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
