// Progress component
//
// A single native <progress>, no wrapper. Indeterminate (browser-animated)
// when `value` is absent; determinate as a fraction of `max` otherwise.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — optional; omit for an indeterminate progress bar.
//   max — default 100.
//
// References:
//   - components/progress/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "max"]);

export class Progress extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > progress.progress")) return;

        const progress = document.createElement("progress");
        progress.className = rootClassName(this, "progress");
        const label = this.getAttribute("label");
        if (label !== null) progress.setAttribute("aria-label", label);
        const value = this.getAttribute("value");
        if (value !== null) progress.value = Number(value);
        progress.max = Number(this.getAttribute("max") ?? "100");
        passThroughAttributes(this, progress, HANDLED);

        this.appendChild(progress);
    }
}
