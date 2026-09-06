// Citation component
//
// A citation acknowledges the relevance of another work to the topic of
// discussion. A native <cite> for citation semantics; the consumer's
// content (typically the title of the referenced work) is moved inside.
//
// No attributes beyond the shared class hook.
//
// References:
//   - components/citation/index.md (canonical contract)
//   - MDN <cite> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set<string>();

export class Citation extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > cite.citation")) return;

        const cite = document.createElement("cite");
        cite.className = rootClassName(this, "citation");
        passThroughAttributes(this, cite, HANDLED);

        moveChildrenInto(this, cite);
        this.appendChild(cite);
    }
}
