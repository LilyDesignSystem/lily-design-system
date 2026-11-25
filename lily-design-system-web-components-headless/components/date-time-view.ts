// DateTimeView component
//
// A read-only display of a formatted date and time: a native <time>
// with its `datetime` attribute set to the consumer-supplied ISO 8601
// value. The component performs no formatting or localization; display
// text falls back children → format → value.
//
// Attributes:
//   value — REQUIRED. ISO 8601 datetime string, becomes the `datetime`
//     attribute.
//   format — optional pre-formatted display text (used when there are
//     no light-DOM children).
//   label — optional aria-label override.
//   ...rest — spread onto the <time>.
// A change to value, format, label or class is shown.
//
// References:
//   - components/date-time-view/index.md (canonical contract)
//   - MDN time: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement } from "../lib/live-element.js";

const HANDLED = new Set(["value", "format", "label"]);

export class DateTimeView extends LiveElement {
    #value: string | null = null;
    #format: string | null = null;
    #content = false;

    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLTimeElement>(":scope > time.date-time-view");
        // Read once and held, so not left on the host too (PHI.md): datetime stays, as semantics, and is listed there. A new value
        // without its format shows itself, so the last date's words are never kept.
        if (this.hasAttribute("value") || this.hasAttribute("format")) {
            if (this.hasAttribute("value")) this.#value = this.text("value");
            this.#format = this.getAttribute("format");
            this.removeAttribute("value");
            this.removeAttribute("format");
        }
        // A copy of an element (cloneNode) holds what was shown, and nothing to show instead until it is given a value.
        if (existing && this.#value === null && this.#format === null && !this.#content) return;
        const time = existing ?? document.createElement("time");
        time.className = rootClassName(this, "date-time-view");
        time.dateTime = this.#value ?? "";
        const label = this.getAttribute("label");
        if (label !== null) time.setAttribute("aria-label", label);
        else time.removeAttribute("aria-label");
        if (!existing) {
            passThroughAttributes(this, time, HANDLED);
            this.#content = this.childNodes.length > 0;
            if (this.#content) moveChildrenInto(this, time);
            this.appendChild(time);
        }
        if (!this.#content) time.textContent = this.#format ?? this.#value ?? "";
    }
}
