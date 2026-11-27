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
import { setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["cite", "citation-text", "label"]);

export class Blockquote extends HTMLElement {
    // A change to cite, label, citation-text or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["cite", "label", "citation-text", "class"];
    }

    attributeChangedCallback(): void {
        const el = this.querySelector<HTMLQuoteElement>(":scope > blockquote.blockquote");
        if (!el) return;
        el.className = rootClassName(this, "blockquote");
        setOrRemove(el, "cite", this.getAttribute("cite"));
        setOrRemove(el, "aria-label", this.getAttribute("label"));
        const citationText = this.getAttribute("citation-text");
        let footer = el.querySelector<HTMLElement>(":scope > footer.blockquote-citation");
        if (citationText === null) footer?.remove();
        else {
            if (!footer) {
                footer = document.createElement("footer");
                footer.className = "blockquote-citation";
                el.appendChild(footer);
            }
            footer.textContent = citationText;
        }
    }

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
