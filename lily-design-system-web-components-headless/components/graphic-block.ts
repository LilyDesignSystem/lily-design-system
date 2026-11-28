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
import { setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["label", "title", "description", "notes"]);

export class GraphicBlock extends HTMLElement {
    #caption: HTMLElement | null = null;

    // A change to label, title, description, notes or class is shown (tasks.md P50-T28): the caption is built again in place.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const figure = this.querySelector<HTMLElement>(":scope > figure.graphic-block");
        if (!figure) return;
        this.#name(figure);
        this.#caption?.remove();
        this.#caption = this.#buildCaption();
        if (this.#caption) figure.prepend(this.#caption);
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > figure.graphic-block")) return;

        const figure = document.createElement("figure");
        this.#name(figure);
        figure.setAttribute("role", "img");
        passThroughAttributes(this, figure, HANDLED);

        this.#caption = this.#buildCaption();
        if (this.#caption) figure.appendChild(this.#caption);

        const content = document.createElement("div");
        content.className = "graphic-block-content";
        moveChildrenInto(this, content);
        figure.appendChild(content);

        this.appendChild(figure);
    }

    #name(figure: HTMLElement): void {
        figure.className = rootClassName(this, "graphic-block");
        setOrRemove(figure, "aria-label", this.getAttribute("label"));
    }

    #buildCaption(): HTMLElement | null {
        const title = this.getAttribute("title");
        const description = this.getAttribute("description");
        const notes = this.getAttribute("notes");
        if (title === null && description === null && notes === null) return null;
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
        return figcaption;
    }
}
