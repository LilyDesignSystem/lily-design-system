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
//
// References:
//   - components/date-time-view/index.md (canonical contract)
//   - MDN time: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["value", "format", "label"]);

export class DateTimeView extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > time.date-time-view")) return;

        const hasChildren = this.childNodes.length > 0;

        const time = document.createElement("time");
        time.className = rootClassName(this, "date-time-view");
        time.dateTime = this.getAttribute("value") ?? "";
        const label = this.getAttribute("label");
        if (label !== null) time.setAttribute("aria-label", label);
        passThroughAttributes(this, time, HANDLED);

        if (hasChildren) {
            moveChildrenInto(this, time);
        } else {
            const format = this.getAttribute("format");
            time.textContent = format ?? this.getAttribute("value") ?? "";
        }

        this.appendChild(time);
    }
}
