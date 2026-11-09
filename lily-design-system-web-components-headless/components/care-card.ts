// CareCard component
//
// A medical care instruction card with urgency levels (NHS England
// inspired). Renders a <div role="group"> with an <h2> heading and body
// content, not a landmark, so a page of cards does not flood the landmark
// list.
//
// Attributes:
//   type — "non-urgent" | "urgent" | "immediate", default "non-urgent".
//     Exposed as data-type.
//   heading — REQUIRED. Heading text, rendered in an <h2>.
//   label — optional. aria-label override; defaults to the heading text.
//
// References:
//   - components/care-card/index.md (canonical contract)
//   - NHS England Care Cards: https://service-manual.nhs.uk/design-system/components/care-cards

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["type", "heading", "label"]);

export class CareCard extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > div.care-card")) return;

        const div = document.createElement("div");
        div.className = rootClassName(this, "care-card");
        div.setAttribute("role", "group");
        const heading = this.getAttribute("heading") ?? "";
        const label = this.getAttribute("label");
        div.setAttribute("aria-label", label ?? heading);
        div.setAttribute("data-type", this.getAttribute("type") ?? "non-urgent");
        passThroughAttributes(this, div, HANDLED);

        const h2 = document.createElement("h2");
        h2.textContent = heading;
        div.appendChild(h2);

        moveChildrenInto(this, div);
        this.appendChild(div);
    }
}
