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
import { part } from "../lib/live-element.js";

const HANDLED = new Set<string>(["label"]);

export class Citation extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const root = this.querySelector(":scope > cite.citation");
        if (!root) return;
        root.className = rootClassName(this, "citation");
        root.querySelector(":scope > .screen-reader-span")?.remove();
        const label = this.getAttribute("label");
        if (label) root.prepend(part("screen-reader-span", `${label} `));
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > cite.citation")) return;

        const cite = document.createElement("cite");
        cite.className = rootClassName(this, "citation");
        passThroughAttributes(this, cite, HANDLED);

        moveChildrenInto(this, cite);
        const label = this.getAttribute("label");
        if (label) {
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${label} `;
            cite.prepend(hidden);
        }
        this.appendChild(cite);
    }
}
