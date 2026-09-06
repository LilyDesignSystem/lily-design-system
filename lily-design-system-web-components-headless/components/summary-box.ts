// SummaryBox component
//
// A boxed <aside> callout highlighting key takeaways or next steps from a
// longer page, with a required heading rendered as a real <h3> and a body
// region for the consumer's light-DOM children.
//
// Attributes:
//   heading — REQUIRED. Box heading text, rendered in
//     <h3 class="summary-box-heading">.
//   label — optional. aria-label override; defaults to the heading text.
//
// References:
//   - components/summary-box/index.md (canonical contract)
//   - US Web Design System Summary Box: https://designsystem.digital.gov/components/summary-box/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["heading", "label"]);

export class SummaryBox extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > aside.summary-box")) return;

        const heading = this.getAttribute("heading") ?? "";
        const label = this.getAttribute("label");

        const aside = document.createElement("aside");
        aside.className = rootClassName(this, "summary-box");
        aside.setAttribute("aria-label", label !== null ? label : heading);
        passThroughAttributes(this, aside, HANDLED);

        const h3 = document.createElement("h3");
        h3.className = "summary-box-heading";
        h3.textContent = heading;
        aside.appendChild(h3);

        const body = document.createElement("div");
        body.className = "summary-box-body";
        moveChildrenInto(this, body);
        aside.appendChild(body);

        this.appendChild(aside);
    }
}
