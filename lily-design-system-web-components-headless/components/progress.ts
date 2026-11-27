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
import { LiveElement, setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["label", "value", "max"]);

// A change to its attributes, or to class, is shown (tasks.md P50-T28).
export class Progress extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLProgressElement>(":scope > progress.progress");
        const progress = existing ?? document.createElement("progress");
        progress.className = rootClassName(this, "progress");
        setOrRemove(progress, "aria-label", this.getAttribute("label"));
        progress.max = Number(this.getAttribute("max") ?? "100");
        // No value is indeterminate, so the attribute goes, not just the number.
        const value = this.getAttribute("value");
        if (value !== null) progress.value = Number(value);
        else progress.removeAttribute("value");
        if (existing) return;
        passThroughAttributes(this, progress, HANDLED);
        this.appendChild(progress);
    }
}
