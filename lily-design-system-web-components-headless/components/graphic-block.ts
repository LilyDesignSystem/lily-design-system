// GraphicBlock component
//
// A <figure role="img"> wrapper for charts and graphics, pairing the
// consumer's chart/graphic content with structural metadata: title,
// description, and notes/source, gathered inside a <figcaption>.
//
// Attributes:
//   label — REQUIRED. Accessible label describing the graphic, via
//     aria-label.
//   title — optional. Title displayed above the graphic.
//   description — optional. Description text below the title.
//   notes — optional. Notes/source text below the graphic.
//
// References:
//   - components/graphic-block/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "title", "description", "notes"]);

export class GraphicBlock extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > figure.graphic-block")) return;

        const figure = document.createElement("figure");
        figure.className = rootClassName(this, "graphic-block");
        figure.setAttribute("role", "img");
        const label = this.getAttribute("label");
        if (label !== null) figure.setAttribute("aria-label", label);
        passThroughAttributes(this, figure, HANDLED);

        const title = this.getAttribute("title");
        const description = this.getAttribute("description");
        const notes = this.getAttribute("notes");
        if (title !== null || description !== null || notes !== null) {
            const figcaption = document.createElement("figcaption");
            figcaption.className = "graphic-block-caption";
            if (title !== null) {
                const div = document.createElement("div");
                div.className = "graphic-block-title";
                div.textContent = title;
                figcaption.appendChild(div);
            }
            if (description !== null) {
                const div = document.createElement("div");
                div.className = "graphic-block-description";
                div.textContent = description;
                figcaption.appendChild(div);
            }
            if (notes !== null) {
                const div = document.createElement("div");
                div.className = "graphic-block-notes";
                div.textContent = notes;
                figcaption.appendChild(div);
            }
            figure.appendChild(figcaption);
        }

        const content = document.createElement("div");
        content.className = "graphic-block-content";
        moveChildrenInto(this, content);
        figure.appendChild(content);

        this.appendChild(figure);
    }
}
