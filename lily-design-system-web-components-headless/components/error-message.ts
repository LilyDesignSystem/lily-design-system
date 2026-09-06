// ErrorMessage component
//
// An error message associated with a form field, announced immediately
// via role="alert" (an implicit assertive live region).
//
// Deviation note: components/error-message/AGENTS.md is internally
// inconsistent — its "HTML tag" metadata field (the single source of
// truth per this catalog's headless design rules) says `<span>`, but
// its own "Key Behaviors" prose says "Renders a <p> element". The
// cross-catalog implementations disagree with each other too
// (lily-design-system-svelte-headless renders a <p>;
// lily-design-system-html-headless renders a <span> — without even a
// role). Followed the metadata field (the declared single source of
// truth) for the tag, and the ARIA section (undisputed across every
// source) for the role: a <span role="alert">.
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
        if (this.querySelector(":scope > span.error-message")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "error-message");
        span.setAttribute("role", "alert");
        passThroughAttributes(this, span, HANDLED);

        moveChildrenInto(this, span);
        this.appendChild(span);
    }
}
