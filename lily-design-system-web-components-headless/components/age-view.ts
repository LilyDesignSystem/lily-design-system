// <lily-age-view>: a person's age in the consumer's words, usually from ageParts() (spec/healthcare-ui item 6).
// Renders a light-DOM <span class="age-view">. Attributes: label, value, duration (ISO 8601 -> data-duration).
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "duration"]);

export class AgeView extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.age-view")) return;
        const span = document.createElement("span");
        span.className = rootClassName(this, "age-view");
        const duration = this.getAttribute("duration");
        if (duration) span.setAttribute("data-duration", duration);
        const label = this.getAttribute("label");
        if (label) {
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${label} `;
            span.append(hidden);
        }
        span.append(this.getAttribute("value") ?? "");
        passThroughAttributes(this, span, HANDLED);
        this.appendChild(span);
    }
}
