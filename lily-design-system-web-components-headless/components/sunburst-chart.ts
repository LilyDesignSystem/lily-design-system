// SunburstChart component
//
// A headless wrapper for a radial chart showing a hierarchy as concentric rings of arcs. Renders a <figure> holding a
// role="img" graphic wrapper around the consumer-supplied inline <svg>. No
// drawing happens here (headless).
//
// Attributes:
//   label — optional. Accessible name of the image wrapper, via aria-label.
//   Other attributes (id, data-*, aria-*) are passed through to the <figure>.
//
// Data table alternative: a child marked slot="data-table" is the accessible
// table alternative. It is moved into <div class="sunburst-chart-data-table">, a
// SIBLING of the image wrapper — never inside it: role="img" makes
// descendants presentational, so a table inside would be invisible to
// assistive technology. The wrapper exists only when such a child is present.
//
// References:
//   - components/sunburst-chart/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class SunburstChart extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > figure.sunburst-chart")) return;

        const figure = document.createElement("figure");
        figure.className = rootClassName(this, "sunburst-chart");
        passThroughAttributes(this, figure, HANDLED);

        const graphic = document.createElement("div");
        graphic.className = "sunburst-chart-graphic";
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
            wrap.className = "sunburst-chart-data-table";
            for (const t of tables) wrap.appendChild(t);
            figure.appendChild(wrap);
        }
        this.appendChild(figure);
    }
}
