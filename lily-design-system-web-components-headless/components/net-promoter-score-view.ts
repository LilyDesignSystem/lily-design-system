// NetPromoterScoreView component
//
// A headless read-only display of a Net Promoter Score (NPS) in a native
// <span>. Part of the Input/View pattern — pairs with
// NetPromoterScoreRadioGroup. No score validation or classification logic;
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
import { LiveElement, part } from "../lib/live-element.js";

const HANDLED = new Set(["label", "value"]);

// A change to label, value or class is shown (tasks.md P50-T28).
export class NetPromoterScoreView extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLSpanElement>(
            ":scope > span.net-promoter-score-view",
        );
        const span = existing ?? document.createElement("span");
        span.className = rootClassName(this, "net-promoter-score-view");
        const value = this.text("value");
        span.replaceChildren();
        if (this.text("label")) span.append(part("screen-reader-span", `${this.text("label")} `));
        span.append(value);
        if (existing) return;
        passThroughAttributes(this, span, HANDLED);
        this.appendChild(span);
    }

    get value(): string {
        return this.text("value");
    }

    set value(v: string) {
        this.setAttribute("value", v);
        this.flush();
    }
}
