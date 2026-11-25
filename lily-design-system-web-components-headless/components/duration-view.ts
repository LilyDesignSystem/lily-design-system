// <lily-duration-view>: a length of time in the consumer's words, in a <time> whose datetime is the ISO 8601 duration (tasks.md
// P29-T6). Renders a light-DOM <time class="duration-view">. Attributes: value (the words), duration (ISO 8601 -> datetime;
// a negative one adds data-negative, and years or months give no datetime), label (hidden text).
import { htmlDuration } from "../lib/clinical-format.js";
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "duration"]);

export class DurationView extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > time.duration-view")) return;
        const time = document.createElement("time");
        time.className = rootClassName(this, "duration-view");
        const parsed = htmlDuration(this.getAttribute("duration") ?? "");
        if (parsed) {
            time.setAttribute("datetime", parsed.datetime);
            if (parsed.negative) time.setAttribute("data-negative", "");
        }
        const label = this.getAttribute("label");
        if (label) {
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${label} `;
            time.append(hidden);
        }
        time.append(this.getAttribute("value") ?? "");
        passThroughAttributes(this, time, HANDLED);
        this.appendChild(time);
        // Read once, so not left on the host too (PHI.md): datetime stays, as semantics, and is listed there.
        this.removeAttribute("value");
        this.removeAttribute("duration");
    }
}
