// EndNotes component
//
// A section of titled endnote items at the end of an article (methodology,
// sources, credits, corrections). Inspired by Reuters Graphics EndNotes.
//
// Attributes:
//   label — optional, default "End notes". Accessible name, via aria-label.
//   ...rest — spread onto the <section>.
//
// References:
//   - components/end-notes/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class EndNotes extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > section.end-notes")) return;

        const section = document.createElement("section");
        section.className = rootClassName(this, "end-notes");
        section.setAttribute("aria-label", this.getAttribute("label") ?? "End notes");
        passThroughAttributes(this, section, HANDLED);

        moveChildrenInto(this, section);
        this.appendChild(section);
    }
}
