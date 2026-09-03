// Figure component
//
// A <figure role="img"> structural wrapper. The consumer supplies the
// actual visualization (SVG, canvas, an <img>, a charting library's
// output, …) as light-DOM children; this component contributes only the
// semantic container and the accessible name.
//
// Attributes:
//   label — REQUIRED. Accessible name describing the figure content, via
//     aria-label.
//
// References:
//   - components/figure/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Figure extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > figure.figure")) return;

        const figure = document.createElement("figure");
        figure.className = rootClassName(this, "figure");
        figure.setAttribute("role", "img");
        const label = this.getAttribute("label");
        if (label !== null) figure.setAttribute("aria-label", label);
        passThroughAttributes(this, figure, HANDLED);

        moveChildrenInto(this, figure);
        this.appendChild(figure);
    }
}
