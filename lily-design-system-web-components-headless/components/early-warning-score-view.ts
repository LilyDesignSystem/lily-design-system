// <lily-early-warning-score-view>: an early warning score with its band and escalation (spec/healthcare-ui item 5).
// Renders a light-DOM <span class="early-warning-score-view">. Display only: it computes nothing.
// Attributes: label, score, system, band (-> data-band), band-label, escalation.
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "score", "system", "band", "band-label", "escalation"]);

export class EarlyWarningScoreView extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.early-warning-score-view")) return;
        const attr = (name: string) => this.getAttribute(name) ?? "";
        const span = document.createElement("span");
        span.className = rootClassName(this, "early-warning-score-view");
        if (attr("band")) span.setAttribute("data-band", attr("band"));
        const part = (name: string, text: string) => {
            const el = document.createElement("span");
            el.className = `early-warning-score-view-${name}`;
            el.textContent = text;
            return el;
        };
        if (attr("label")) {
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${attr("label")} `;
            span.append(hidden);
        }
        if (attr("system")) span.append(part("system", attr("system")), " ");
        span.append(part("score", attr("score")));
        if (attr("band-label")) span.append(" ", part("band", attr("band-label")));
        if (attr("escalation")) span.append(" ", part("escalation", attr("escalation")));
        passThroughAttributes(this, span, HANDLED);
        this.appendChild(span);
    }
}
