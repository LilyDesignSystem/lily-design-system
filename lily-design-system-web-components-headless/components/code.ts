// Code component
//
// An inline code span for displaying short code snippets within
// surrounding text. Uses the native <code> element for semantic inline
// code; purely presentational, no interactive behaviour.
//
// No attributes beyond the shared class hook.
//
// References:
//   - components/code/index.md (canonical contract)
//   - MDN <code> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code

import {
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
    followClass,
} from "../lib/dom-utils.js";

const HANDLED = new Set<string>();

export class Code extends HTMLElement {
    // Its content is the consumer's children, which they change directly; a change to class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["class"];
    }

    attributeChangedCallback(): void {
        followClass(this, "code.code", "code");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > code.code")) return;

        const code = document.createElement("code");
        code.className = rootClassName(this, "code");
        passThroughAttributes(this, code, HANDLED);

        moveChildrenInto(this, code);
        this.appendChild(code);
    }
}
