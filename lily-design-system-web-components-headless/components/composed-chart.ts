// ComposedChart component
//
// A headless wrapper for a chart that combines several chart types, such as bars and a line, on shared axes. Renders a <figure> holding a
// role="img" graphic wrapper around the consumer-supplied inline <svg>. No
// drawing happens here (headless).
//
// Attributes:
//   label — optional. Accessible name of the image wrapper, via aria-label.
//   Other attributes (id, data-*, aria-*) are passed through to the <figure>.
//
// Data table alternative: a child marked slot="data-table" is the accessible
// table alternative. It is moved into <div class="composed-chart-data-table">, a
// SIBLING of the image wrapper — never inside it: role="img" makes
// descendants presentational, so a table inside would be invisible to
// assistive technology. The wrapper exists only when such a child is present.
//
// References:
//   - components/composed-chart/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class ComposedChart extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > figure.composed-chart")) return;

        const figure = document.createElement("figure");
        figure.className = rootClassName(this, "composed-chart");
        passThroughAttributes(this, figure, HANDLED);

        const graphic = document.createElement("div");
        graphic.className = "composed-chart-graphic";
        graphic.setAttribute("role", "img");
        const label = this.getAttribute("label");
        if (label !== null) graphic.setAttribute("aria-label", label);

        // Pull the slot="data-table" children out before the rest become the graphic.
        const tables = Array.from(this.children).filter((c) => c.getAttribute("slot") === "data-table");
        for (const t of tables) this.removeChild(t);

        moveChildrenInto(this, graphic);
        figure.appendChild(graphic);

        if (tables.length > 0) {
            const wrap = document.createElement("div");
            wrap.className = "composed-chart-data-table";
            for (const t of tables) wrap.appendChild(t);
            figure.appendChild(wrap);
        }
        this.appendChild(figure);
    }
}
