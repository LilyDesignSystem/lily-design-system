// EndNotes component
//
// A section of titled endnote items at the end of an article (methodology,
// sources, credits, corrections). Inspired by Reuters Graphics EndNotes.
//
// Attributes:
//   label — required. Accessible name, via aria-label.
//   ...rest — spread onto the <section>.
//
// References:
//   - components/end-notes/index.md (canonical contract)

import {
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
    followLabel,
} from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class EndNotes extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(): void {
        followLabel(this, "section.end-notes", "end-notes");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > section.end-notes")) return;

        const section = document.createElement("section");
        section.className = rootClassName(this, "end-notes");
        const label = this.getAttribute("label");
        if (label !== null) section.setAttribute("aria-label", label);
        passThroughAttributes(this, section, HANDLED);

        moveChildrenInto(this, section);
        this.appendChild(section);
    }
}
