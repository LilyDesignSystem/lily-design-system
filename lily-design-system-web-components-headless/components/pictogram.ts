// Pictogram component
//
// A <figure> pairing an icon with a title and description in a centered or
// side layout. The icon is a REQUIRED slot — a light-DOM child marked
// `slot="icon"` — not the component's default children, since children
// are reserved for overriding the description.
//
// Attributes:
//   layout — "centered" | "side", default "centered". Exposed as
//     data-layout.
//   heading — optional. Rendered as <h3 class="pictogram-heading">.
//   description — optional. Rendered as <p class="pictogram-description">;
//     overridden by any remaining light-DOM children (besides the icon
//     slot).
//   label — optional. aria-label override.
//
// A `[slot="icon"]` light-DOM child is REQUIRED and is moved into
// <div class="pictogram-icon" aria-hidden="true">.
//
// References:
//   - components/pictogram/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["layout", "heading", "description", "label"]);

export class Pictogram extends HTMLElement {
    #heading: HTMLElement | null = null;
    // The description this element built from the attribute; null when the consumer's children stand in for it.
    #description: HTMLElement | null = null;
    #ownCaption = false;

    // A change to layout, heading, description, label or class is shown (tasks.md P50-T28). Children given in place of the
    // description stay; the description attribute then has nothing to change.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const figure = this.querySelector<HTMLElement>(":scope > figure.pictogram");
        const caption = figure?.querySelector<HTMLElement>(":scope > figcaption.pictogram-caption");
        if (!figure || !caption) return;
        figure.className = rootClassName(this, "pictogram");
        figure.setAttribute("data-layout", this.getAttribute("layout") ?? "centered");
        setOrRemove(figure, "aria-label", this.getAttribute("label"));

        const heading = this.getAttribute("heading");
        if (heading === null) {
            this.#heading?.remove();
            this.#heading = null;
        } else {
            if (!this.#heading) {
                this.#heading = document.createElement("h3");
                this.#heading.className = "pictogram-heading";
                caption.prepend(this.#heading);
            }
            this.#heading.textContent = heading;
        }

        if (!this.#ownCaption) return;
        const description = this.getAttribute("description");
        if (description === null) {
            this.#description?.remove();
            this.#description = null;
        } else {
            if (!this.#description) {
                this.#description = document.createElement("p");
                this.#description.className = "pictogram-description";
                caption.appendChild(this.#description);
            }
            this.#description.textContent = description;
        }
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > figure.pictogram")) return;

        const figure = document.createElement("figure");
        figure.className = rootClassName(this, "pictogram");
        figure.setAttribute("data-layout", this.getAttribute("layout") ?? "centered");
        const label = this.getAttribute("label");
        if (label !== null) figure.setAttribute("aria-label", label);
        passThroughAttributes(this, figure, HANDLED);

        const iconSlot = this.querySelector(':scope > [slot="icon"]');
        const iconDiv = document.createElement("div");
        iconDiv.className = "pictogram-icon";
        iconDiv.setAttribute("aria-hidden", "true");
        if (iconSlot) iconDiv.appendChild(iconSlot);
        figure.appendChild(iconDiv);

        const figcaption = document.createElement("figcaption");
        figcaption.className = "pictogram-caption";

        const heading = this.getAttribute("heading");
        if (heading !== null) {
            const h3 = document.createElement("h3");
            h3.className = "pictogram-heading";
            h3.textContent = heading;
            figcaption.appendChild(h3);
            this.#heading = h3;
        }

        if (this.childNodes.length > 0) {
            while (this.firstChild) figcaption.appendChild(this.firstChild);
        } else {
            this.#ownCaption = true;
            const description = this.getAttribute("description");
            if (description !== null) {
                const p = document.createElement("p");
                p.className = "pictogram-description";
                p.textContent = description;
                figcaption.appendChild(p);
                this.#description = p;
            }
        }

        figure.appendChild(figcaption);
        this.appendChild(figure);
    }
}
