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
import { LiveElement } from "../lib/live-element.js";

const HANDLED = new Set(["type", "heading", "label"]);

// A change to its attributes, or to class, is shown (tasks.md P50-T28).
export class CareCard extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLDivElement>(":scope > div.care-card");
        const div = existing ?? document.createElement("div");
        div.className = rootClassName(this, "care-card");
        div.setAttribute("role", "group");
        const heading = this.text("heading");
        div.setAttribute("aria-label", this.getAttribute("label") ?? heading);
        div.setAttribute("data-type", this.getAttribute("type") ?? "non-urgent");
        if (existing) {
            const h2 = div.querySelector(":scope > h2");
            if (h2) h2.textContent = heading;
            return;
        }
        passThroughAttributes(this, div, HANDLED);
        const h2 = document.createElement("h2");
        h2.textContent = heading;
        div.appendChild(h2);
        moveChildrenInto(this, div);
        this.appendChild(div);
    }
}
