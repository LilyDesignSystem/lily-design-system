// TimelineList component
//
// An ordered list of TimelineListItem components — chronological events or
// milestones. Consumers add <time> elements with `datetime` attributes
// within items for machine-readable dates.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   ...rest — spread onto the <ol>.
//
// References:
//   - components/timeline-list/index.md (canonical contract)
//   - HTML <time> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
//   - WAI-ARIA list role: https://www.w3.org/TR/wai-aria-1.2/#list

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class TimelineList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > ol.timeline-list")) return;

        const ol = document.createElement("ol");
        ol.className = rootClassName(this, "timeline-list");
        const label = this.getAttribute("label");
        if (label !== null) ol.setAttribute("aria-label", label);
        passThroughAttributes(this, ol, HANDLED);

        moveChildrenInto(this, ol);
        this.appendChild(ol);
    }
}
