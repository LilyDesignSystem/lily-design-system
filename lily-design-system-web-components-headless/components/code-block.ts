// CodeBlock component
//
// A block of formatted code with optional line numbers and line
// highlighting. Uses <pre> to preserve whitespace and line breaks,
// containing a nested <code> element for semantic code marking. The
// consumer's content is moved into the inner <code>.
//
// Attributes:
//   label — optional. Accessible label describing the code content; when
//     present, also sets role="region" on the <pre>.
//   line-numbers — presence-based boolean; reflected as data-line-numbers.
//   highlight-lines — comma-separated line numbers to highlight; reflected
//     as data-highlight-lines.
//
// References:
//   - components/code-block/index.md (canonical contract)
//   - MDN <pre> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "line-numbers", "highlight-lines"]);

export class CodeBlock extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > pre.code-block")) return;

        const pre = document.createElement("pre");
        pre.className = rootClassName(this, "code-block");

        const label = this.getAttribute("label");
        if (label !== null) {
            pre.setAttribute("aria-label", label);
            pre.setAttribute("role", "region");
        }
        if (this.hasAttribute("line-numbers")) pre.setAttribute("data-line-numbers", "true");
        const highlightLines = this.getAttribute("highlight-lines");
        if (highlightLines !== null) pre.setAttribute("data-highlight-lines", highlightLines);

        passThroughAttributes(this, pre, HANDLED);

        const code = document.createElement("code");
        moveChildrenInto(this, code);
        pre.appendChild(code);
        this.appendChild(pre);
    }
}
