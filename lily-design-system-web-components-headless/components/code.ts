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

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set<string>();

export class Code extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > code.code")) return;

        const code = document.createElement("code");
        code.className = rootClassName(this, "code");
        passThroughAttributes(this, code, HANDLED);

        moveChildrenInto(this, code);
        this.appendChild(code);
    }
}
