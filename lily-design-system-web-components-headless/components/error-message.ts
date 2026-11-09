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

const HANDLED = new Set<string>([]);

export class ErrorMessage extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > p.error-message")) return;

        const p = document.createElement("p");
        p.className = rootClassName(this, "error-message");
        p.setAttribute("role", "alert");
        passThroughAttributes(this, p, HANDLED);

        moveChildrenInto(this, p);
        this.appendChild(p);
    }
}
