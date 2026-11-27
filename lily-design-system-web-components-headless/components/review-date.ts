// ReviewDate component
//
// A semantic <time> element pairing a machine-readable datetime with
// consumer-supplied human-readable display text. NOTE: its own
// AGENTS.md metadata says "HTML tag: <span>" but its "Key Behaviors"
// section, and the canonical svelte/react/vue-headless sources, all
// agree on a real <time> — followed here as the real contract.
//
// Attributes:
//   label — REQUIRED. Accessible label for screen readers, via
//     aria-label.
//   datetime — REQUIRED. ISO 8601 date/time string for machine
//     readability.
//   ...rest — spread onto the <time>.
//
// References:
//   - components/review-date/index.md (canonical contract)
//   - MDN <time>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
//   - ISO 8601: https://en.wikipedia.org/wiki/ISO_8601

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement, part, setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["label", "datetime"]);

// A change to label, datetime or class is shown (tasks.md P50-T28); the date's words are the consumer's children.
export class ReviewDate extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLTimeElement>(":scope > time.review-date");
        const time = existing ?? document.createElement("time");
        time.className = rootClassName(this, "review-date");
        setOrRemove(time, "datetime", this.getAttribute("datetime"));
        if (!existing) {
            passThroughAttributes(this, time, HANDLED);
            moveChildrenInto(this, time);
        }
        time.querySelector(":scope > .screen-reader-span")?.remove();
        if (this.text("label")) time.prepend(part("screen-reader-span", `${this.text("label")} `));
        if (!existing) this.appendChild(time);
    }
}
