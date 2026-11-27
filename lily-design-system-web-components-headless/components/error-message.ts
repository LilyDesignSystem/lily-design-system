// ErrorMessage component
//
// An error message associated with a form field, a <p role="alert">
// (an implicit assertive live region), as Svelte renders it.
//
// Attributes: none beyond the base class + rest-props.
//   children — REQUIRED. Error message text content.
//
// References:
//   - components/error-message/index.md (canonical contract)
//   - WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alert/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement } from "../lib/live-element.js";

const HANDLED = new Set<string>([]);

// Its content is the consumer's children, which they change directly; a change to class is shown (tasks.md P50-T28).
export class ErrorMessage extends LiveElement {
    static get observedAttributes(): string[] {
        return ["class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLElement>(":scope > p.error-message");
        if (existing) {
            existing.className = rootClassName(this, "error-message");
            return;
        }
        const p = document.createElement("p");
        p.className = rootClassName(this, "error-message");
        p.setAttribute("role", "alert");
        passThroughAttributes(this, p, HANDLED);
        moveChildrenInto(this, p);
        this.appendChild(p);
    }
}
