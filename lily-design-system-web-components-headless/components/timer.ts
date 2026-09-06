// Timer component
//
// A countdown or elapsed time display. Wraps a real
// <time role="timer" aria-live="polite">. The consumer manages the
// actual timer logic (intervals, countdowns) and provides the formatted
// display text as children; this component only provides structure and
// accessibility.
//
// NOTE: this catalog's own root AGENTS.md "HTML tag" field says `<span>`,
// but its own "Key Behaviors" section (and the Svelte/React canonical
// implementations) render a `<time>` element — the more specific,
// semantically correct choice per AGENTS/headless.md ("choose the most
// specific semantic HTML element that fits"). This port follows `<time>`.
//
// Attributes:
//   label — REQUIRED. Accessible label, via aria-label.
//   ...rest — spread onto the <time> (e.g. datetime="PT5M30S").
//
// References:
//   - components/timer/index.md (canonical contract)
//   - WAI-ARIA timer role: https://www.w3.org/TR/wai-aria-1.2/#timer
//   - HTML <time> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Timer extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > time.timer")) return;

        const time = document.createElement("time");
        time.className = rootClassName(this, "timer");
        time.setAttribute("role", "timer");
        time.setAttribute("aria-live", "polite");
        const label = this.getAttribute("label");
        if (label !== null) time.setAttribute("aria-label", label);
        passThroughAttributes(this, time, HANDLED);

        moveChildrenInto(this, time);
        this.appendChild(time);
    }
}
