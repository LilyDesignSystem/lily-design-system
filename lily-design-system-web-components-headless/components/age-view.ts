// <lily-age-view>: a person's age in the consumer's words, usually from ageParts() (spec/healthcare-ui item 6).
// Renders a light-DOM <span class="age-view">. Attributes: label, value, duration (ISO 8601 -> data-duration). A change to any of
// them, or to class, is shown.
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement, part, setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["label", "value", "duration"]);

export class AgeView extends LiveElement {
    #value: string | null = null;
    #duration: string | null = null;

    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLSpanElement>(":scope > span.age-view");
        // Read once and held, so not left on the host too (PHI.md): data-duration stays, for a theme, and is listed there. A new
        // age without its duration has none, so the last person's is never kept.
        if (this.hasAttribute("value") || this.hasAttribute("duration")) {
            if (this.hasAttribute("value")) this.#value = this.text("value");
            this.#duration = this.getAttribute("duration");
            this.removeAttribute("value");
            this.removeAttribute("duration");
        }
        // A copy of an element (cloneNode) holds what was shown, and nothing to show instead until it is given a value.
        if (existing && this.#value === null) return;
        const span = existing ?? document.createElement("span");
        span.className = rootClassName(this, "age-view");
        setOrRemove(span, "data-duration", this.#duration);
        span.replaceChildren();
        if (this.text("label")) span.append(part("screen-reader-span", `${this.text("label")} `));
        span.append(this.#value ?? "");
        if (existing) return;
        passThroughAttributes(this, span, HANDLED);
        this.appendChild(span);
    }
}
