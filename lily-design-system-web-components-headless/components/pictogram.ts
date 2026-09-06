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

const HANDLED = new Set(["layout", "heading", "description", "label"]);

export class Pictogram extends HTMLElement {
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
        }

        if (this.childNodes.length > 0) {
            while (this.firstChild) figcaption.appendChild(this.firstChild);
        } else {
            const description = this.getAttribute("description");
            if (description !== null) {
                const p = document.createElement("p");
                p.className = "pictogram-description";
                p.textContent = description;
                figcaption.appendChild(p);
            }
        }

        figure.appendChild(figcaption);
        this.appendChild(figure);
    }
}
