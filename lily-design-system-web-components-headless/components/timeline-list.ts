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
import { setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["label", "coverage-label"]);

export class TimelineList extends HTMLElement {
    // A change to label, coverage-label or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["label", "coverage-label", "class"];
    }

    attributeChangedCallback(): void {
        const el = this.querySelector<HTMLOListElement>(":scope > ol.timeline-list");
        if (!el) return;
        el.className = rootClassName(this, "timeline-list");
        setOrRemove(el, "aria-label", this.getAttribute("label"));
        const coverage = this.getAttribute("coverage-label");
        let li = el.querySelector<HTMLLIElement>(":scope > .timeline-list-coverage");
        if (!coverage) li?.remove();
        else {
            if (!li) {
                li = document.createElement("li");
                li.className = "timeline-list-coverage";
                // An item of its own, first.
                el.prepend(li);
            }
            li.textContent = coverage;
        }
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > ol.timeline-list")) return;

        const ol = document.createElement("ol");
        ol.className = rootClassName(this, "timeline-list");
        const label = this.getAttribute("label");
        if (label !== null) ol.setAttribute("aria-label", label);
        passThroughAttributes(this, ol, HANDLED);
        // coverage-label: what the timeline is a view of, in the consumer's words; an item of its own, first.
        const coverage = this.getAttribute("coverage-label");
        if (coverage) {
            const li = document.createElement("li");
            li.className = "timeline-list-coverage";
            li.textContent = coverage;
            ol.append(li);
        }
        moveChildrenInto(this, ol);
        this.appendChild(ol);
    }
}
