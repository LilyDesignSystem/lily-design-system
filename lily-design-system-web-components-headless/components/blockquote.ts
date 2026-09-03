// Blockquote component
//
// A native <blockquote> with an optional attribution footer.
//
// Attributes:
//   cite — optional; maps to the native `cite` attribute (source URL).
//   citation-text — optional; rendered in <footer class="blockquote-citation">.
//   label — optional aria-label override.
//
// References:
//   - components/blockquote/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["cite", "citation-text", "label"]);

export class Blockquote extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > blockquote.blockquote")) return;

        const blockquote = document.createElement("blockquote");
        blockquote.className = rootClassName(this, "blockquote");
        const cite = this.getAttribute("cite");
        if (cite !== null) blockquote.setAttribute("cite", cite);
        const label = this.getAttribute("label");
        if (label !== null) blockquote.setAttribute("aria-label", label);
        passThroughAttributes(this, blockquote, HANDLED);

        moveChildrenInto(this, blockquote);

        const citationText = this.getAttribute("citation-text");
        if (citationText !== null) {
            const footer = document.createElement("footer");
            footer.className = "blockquote-citation";
            footer.textContent = citationText;
            blockquote.appendChild(footer);
        }

        this.appendChild(blockquote);
    }
}
