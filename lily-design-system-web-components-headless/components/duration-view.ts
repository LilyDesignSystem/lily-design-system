// <lily-duration-view>: a length of time in the consumer's words, in a <time> whose datetime is the ISO 8601 duration (tasks.md
// P29-T6). Renders a light-DOM <time class="duration-view">. Attributes: value (the words), duration (ISO 8601 -> datetime;
// a negative one adds data-negative, and years or months give no datetime), label (hidden text). A change to any of
// them, or to class, is shown.
import { htmlDuration } from "../lib/clinical-format.js";
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement, part, setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["label", "value", "duration"]);

export class DurationView extends LiveElement {
    #value: string | null = null;
    #duration: string | null = null;

    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLTimeElement>(":scope > time.duration-view");
        // Read once and held, so not left on the host too (PHI.md): datetime stays, as semantics, and is listed there. New words
        // without their duration have none, so the last one is never kept.
        if (this.hasAttribute("value") || this.hasAttribute("duration")) {
            if (this.hasAttribute("value")) this.#value = this.text("value");
            this.#duration = this.getAttribute("duration");
            this.removeAttribute("value");
            this.removeAttribute("duration");
        }
        // A copy of an element (cloneNode) holds what was shown, and nothing to show instead until it is given a value.
        if (existing && this.#value === null) return;
        const time = existing ?? document.createElement("time");
        time.className = rootClassName(this, "duration-view");
        const parsed = htmlDuration(this.#duration ?? "");
        setOrRemove(time, "datetime", parsed?.datetime);
        time.toggleAttribute("data-negative", parsed?.negative === true);
        time.replaceChildren();
        if (this.text("label")) time.append(part("screen-reader-span", `${this.text("label")} `));
        time.append(this.#value ?? "");
        if (existing) return;
        passThroughAttributes(this, time, HANDLED);
        this.appendChild(time);
    }
}
