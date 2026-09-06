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

const HANDLED = new Set(["label", "datetime"]);

export class ReviewDate extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > time.review-date")) return;

        const time = document.createElement("time");
        time.className = rootClassName(this, "review-date");
        const label = this.getAttribute("label");
        if (label !== null) time.setAttribute("aria-label", label);
        const datetime = this.getAttribute("datetime");
        if (datetime !== null) time.setAttribute("datetime", datetime);
        passThroughAttributes(this, time, HANDLED);

        moveChildrenInto(this, time);
        this.appendChild(time);
    }
}
